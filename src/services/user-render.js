  const products = require("../models/productSchema");
  const categories = require("../models/categorySchema")
  const banners = require("../models/bannerSchema")
  const brands = require("../models/brandSchema")
  const user = require('../models/userSchema')
  const cart = require('../models/cartSchema')
  exports.home = async(req, res) => { 
    const superDeal = await products.find().limit(8).where({ listed :false}).populate('brand').exec();
    const dealOfDay = await products.find().limit(6).where({ listed :false}).populate("brand").exec();
    const category = await categories.find().exec();
    const todayOfferBanner = await banners.findOne({ title: "Fire Bolt" });
    const topDealBanner = await banners.findOne({ title: "Top Deal" });
    console.log(topDealBanner);
    res.render("user/index", {
      user: req.session.user,
      superDeal,
      dealOfDay,
      category,
      todayOfferBanner,
      topDealBanner,
    });
  }

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


exports.signup = async (req, res) => {
  let message = ""; 
  if (req.session.message) {
    message = req.session.message;
    delete req.session.message; 
  }
  res.render('user/signup', { message });
};


exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // Redirect the user to the home page
    res.redirect('/home');
  });
}



  exports.aboutUs = async (req, res) => {  
    const category = await categories.find().exec(); 
    res.render('user/about',
      {
        user: req.session.user,
        category
      })
  }
exports.products = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;
    const productCount = await products.countDocuments();
    const product = await products.find().skip(skip).limit(limit).populate('brand').exec();
    const category = await categories.find();
    const brand = await brands.find();

    res.render("user/product", {
      user: req.session.user,
      product,
      category,
      currentPage: page,
      totalPages: Math.ceil(productCount / limit),
      brand
    });
  } catch (err) {
    console.error("Error fetching products from MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.contactUs = async (req, res) => { 
  const category = await categories.find()
  res.render("user/contact", {
    user: req.session.user,
    category,
  });
}

  
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

exports.checkout =async (req, res) => { 
   const category = await categories.find()
  res.render("user/checkout", { 
    user: req.session.user,
    category
  });
}

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






exports.otplogin = (req, res) => {
  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.render('user/login-otp',)
}


exports.forgotPassword = (req, res) => {
  res.render('user/forgotPassword')
}

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
