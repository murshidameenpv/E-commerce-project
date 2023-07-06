  const products = require("../models/productSchema");
  const categories = require("../models/categorySchema");
  const banners = require("../models/bannerSchema")
  const brands = require("../models/brandSchema")
  const user = require('../models/userSchema')
  const cart = require('../models/cartSchema')
  //RENDER HOME
    exports.home = async(req, res) => { 
      const superDeal = await products.find().limit(8).where({ listed :false}).populate('brand').exec();
      const dealOfDay = await products.find().limit(6).where({ listed :false}).populate("brand").exec();
      const category = await categories.find().exec();
      const todayOfferBanner = await banners.findOne({ title: "Fire Bolt" });
      const topDealBanner = await banners.findOne({ title: "Top Deal" });
      res.render("user/index", {
        user: req.session.user,
        superDeal,
        dealOfDay,
        category,
        todayOfferBanner,
        topDealBanner,
      });
    }
//RENDER LOGIN
exports.login = (req, res) => {
  if (req.session.user) {
    res.redirect('/home')
  } 
     let message = "";// Variable to store the message
  if (req.session.message) {
    message = req.session.message;
    delete req.session.message// Clear the message from the session
  }
  res.render('user/login', { message }); // Pass the message to the user-signup view
  }

//RENDER SIGNUP
exports.signup = async (req, res) => {
  let message = ""; 
  if (req.session.message) {
    message = req.session.message;
    delete req.session.message; 
  }
  res.render('user/signup', { message });
};

//RENDER LOGOUT
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // Redirect the user to the home page
    res.redirect('/home');
  });
}
exports.products = async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;
    let selectedCategory = req.query.category_id || "";
    let selectedBrand = req.query.brand_id || "";
    let sortOption = req.query.sortOption;
    
    let sortQuery = {};
    if (sortOption) {
      if (sortOption === "Name, A to Z") {
        sortQuery = { productName: 1 };
      } else if (sortOption === "Name, Z to A") {
        sortQuery = { productName: -1 };
      } else if (sortOption === "Price, high to low") {
        sortQuery = { price: -1 };
      } else if (sortOption === "Price, low to high") {
        sortQuery = { price: 1 };
      }
    }
    let query = {};
    if (req.query.category_id) {
      query.category = req.query.category_id;
    }
    if (req.query.brand_id) {
      query.brand = req.query.brand_id;
    }
    if (searchQuery) {
      try {
        const categoryMatch = await categories.findOne({
          category: new RegExp(searchQuery, "i"),
        });

        const brandMatch = await brands.findOne({
          brandName: new RegExp(searchQuery, "i"),
        });

        if (categoryMatch) {
          query.category = categoryMatch._id;
          selectedCategory = categoryMatch._id.toString();

          // Find brands with the selected category
          const brandsWithCategory = await brands.find({
            category: categoryMatch._id,
          });
          const brandIds = brandsWithCategory.map((brand) => brand._id);
          query.brand = { $in: brandIds };
        } else if (brandMatch) {
          query.brand = brandMatch._id;
          selectedBrand = brandMatch._id.toString();

          // Find the category of the selected brand
          if (brandMatch.category) {
            selectedCategory = brandMatch.category.toString();
          }
        } else {
          query.productName = new RegExp(searchQuery, "i");
        }
      } catch (err) {
        console.error("Error fetching categories and brands from MongoDB", err);
      }
    }

    const productCount = await products.countDocuments(query);
    const product = await products
      .find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate("brand")
      .exec();

    const category = await categories.find();
    let brand = [];
    if (selectedCategory) {
      try {
        brand = await brands.find({ category: selectedCategory });
      } catch (err) {
        console.error("Error fetching brands from MongoDB", err);
      }
    }
    let categoryCounts;
    try {
      categoryCounts = await Promise.all(
        category.map(async (Category) => {
          const count = await products.countDocuments({
            category: Category._id,
          });
          return { categoryId: Category._id, count };
        })
      );
    } catch (err) {
      console.error("Error fetching product counts from MongoDB", err);
    }

    res.render("user/product", {
      user: req.session.user,
      product,
      category,
      productCount,
      currentPage: page,
      totalPages: Math.ceil(productCount / limit),
      brand,
      selectedCategory,
      selectedBrand,
      page,
      limit,
      sortOption,
      categoryCounts,
      searchQuery,
    });
  } catch (err) {
    console.error("Error fetching products from MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};



//RENDER CONTACT US
exports.contactUs = async (req, res) => { 
  const category = await categories.find()
  res.render("user/contact", {
    user: req.session.user,
    category,
  });
}

  //RENDER PRODUCT DETAILS
  exports.productDetails = async (req, res) => {
    try {
      console.log(req.session.user);
      const productId = req.params.id; // extract the product ID from the query string
      const product = await products.findById({ _id: productId }); // find the product by ID using Mongoose
      res.render("user/details", { product ,user:req.session.user}); // render the product-detail.ejs page and pass the product details
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  };

  //RENDER CHECKOUT
exports.checkout =async (req, res) => { 
   const category = await categories.find()
  res.render("user/checkout", { 
    user: req.session.user,
    category
  });
}
//RENDER CART
exports.cart = async (req, res) => {
  try {
    const category = await categories.find();
    const userId = req.session.user._id;
    const cartItems = await cart.findOne({ userId }).populate("products.productId");
    // Calculate the total amount of the products in the cart
    let total = 0;
    cartItems.products.forEach((product) => {
      total += product.productId.price * product.quantity;
    });
    res.render("user/cart", {
      user: req.session.user,
      category,
      cartItems,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving cart data");
  }
};

//CHECKS PRODUCTS IN CART FOR INVENTORY MANAGEMENT
  exports.checkCart = async (req, res) => {
    try {
      // Get the product ID from the request query parameters
      const { productId } = req.query;
      // Get the userId from the session
      const userId = req.session.user._id;
      // Find the cart for the logged-in user
      const userCart = await cart.findOne({ userId });

      // Find the product in the cart
      const productIndex = userCart.products.findIndex(
        (product) => product.productId.toString() === productId
      );
      if (productIndex !== -1) {
        // Product exists in the cart
        const product = userCart.products[productIndex];
        res.status(200).json({
          inCart: true,
          cartQuantity: product.quantity,
        });
      } else {
        // Product does not exist in the cart
        res.status(200).json({
          inCart: false,
          cartQuantity: 0,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error checking cart data");
    }
  };

//RENDER OTP LOGIN
exports.otplogin = (req, res) => {
  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.render('user/login-otp',)
}

//RENDER FORGOT PASSWORD 
exports.forgotPassword = (req, res) => {
  res.render('user/forgotPassword')
}
//RENDER RESET PASWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(404).send("Page not found");
    }
    const userCredential = await user.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!userCredential) {
      return res.status(404).send("Page not found");
    }
    res.render("user/resetPassword", { token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
