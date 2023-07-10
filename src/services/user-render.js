  const productDb = require("../models/productSchema");
  const categoryDb = require("../models/categorySchema");
  const bannerDb = require("../models/bannerSchema")
  const brandDb = require("../models/brandSchema")
  const userDb = require('../models/userSchema')
  const cartDb = require('../models/cartSchema')
  const wishlistDb = require('../models/wishlistSchema')
  //RENDER HOME
    exports.home = async(req, res) => { 
      const superDeal = await productDb.find().limit(8).where({ listed :false}).populate('brand').exec();
      const dealOfDay = await productDb.find().limit(6).where({ listed :false}).populate("brand").exec();
      const category = await categoryDb.find().exec();
      const todayOfferBanner = await bannerDb.findOne({ title: "Fire Bolt" });
      const topDealBanner = await bannerDb.findOne({ title: "Top Deal" });
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


//render products based on search,filter,sort,pagination
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
        const categoryMatch = await categoryDb.findOne({category: new RegExp(searchQuery, "i"),});
        const brandMatch = await brandDb.findOne({brandName: new RegExp(searchQuery, "i"),});
         if (categoryMatch) {
          query.category = categoryMatch._id;
          selectedCategory = categoryMatch._id.toString();
          // Find brands with the selected category
          const brandsWithCategory = await brandDb.find({ category: categoryMatch._id,});
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
    const productCount = await productDb.countDocuments(query);
    const product = await productDb
      .find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate("brand")
      .exec();

    const category = await categoryDb.find();
    let brand = [];
    if (selectedCategory) {
      try {
        brand = await brandDb.find({ category: selectedCategory });
      } catch (err) {
        console.error("Error fetching brands from MongoDB", err);
      }
    }
    let categoryCounts;
    try {
      categoryCounts = await Promise.all(
        category.map(async (Category) => {
          const count = await productDb.countDocuments({
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
  const category = await categoryDb.find()
  res.render("user/contact", {
    user: req.session.user,
    category,
  });
}

  //RENDER PRODUCT DETAILS
  exports.productDetails = async (req, res) => {
    try {
      const productId = req.params.id; // extract the product ID from the query string
      const product = await productDb.findById({ _id: productId }); // find the product by ID using Mongoose
      res.render("user/details", { product ,user:req.session.user}); // render the product-detail.ejs page and pass the product details
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };

  //RENDER CHECKOUT
exports.checkout =async (req, res) => { 
   const category = await categoryDb.find()
  res.render("user/checkout", { 
    user: req.session.user,
    category
  });
}
exports.cart = async (req, res) => {
  try {
    const category = await categoryDb.find();
    const userId = req.session.user._id;
    const userCart = await cartDb
      .findOne({ userId })
      .populate("products.productId");
    // Calculate the total amount of the products in the cart
    let total = 0;
    if (userCart) {
      userCart.products.forEach((product) => {
        total += product.productId.price * product.quantity;
      });
    }
    res.render("user/cart", {
      user: req.session.user,
      category: category ? category : undefined,
      userCart: userCart ? userCart : undefined,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving cart data");
  }
};



exports.wishlist = async (req, res) => {
  try {
    // Get the user ID from the session
    const userId = req.session.user._id;
    const Wishlist = await wishlistDb.findOne({ userId });
    // Find the products in the wishlist
    let wishlistProducts;
    if (Wishlist) {
      const productIds = Wishlist.products.map((product) => product.productId);
      wishlistProducts = await productDb.find({ _id: { $in: productIds } });
    }
    // Pass the products to the EJS template
    res.render("user/wishlist", {
      wishlistProducts: wishlistProducts ? wishlistProducts : undefined,
      user: req.session.user,
      Wishlist: Wishlist ? Wishlist : undefined,
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send("Internal Server Error");
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
    const userCredential = await userDb.findOne({
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


//add delivery address address 
const formatAddress = (address) => {
  return `${address.firstName} ${address.lastName},${address.addressLine},${address.locality}, ${address.city}, ${address.state}-${address.postalCode},${address.phoneNumber},${address.emailAddress}`;
};
exports.addressDetails = async (req, res) => {
  const userId = req.session.user._id;
  try {
    const { address } = await userDb.findById(userId);
    res.render("user/address", {
      user: req.session.user,
      addressData: address.length > 0 ? address.map(formatAddress) : undefined,
      addressId: address ? address.map((address) => address._id) : undefined,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving addresses");
  }
};
