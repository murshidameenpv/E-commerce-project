const products = require("../models/productSchema");
const categories = require("../models/categorySchema")

exports.home = async(req, res) => { 
  const superDeal = await products.find().limit(8).where({ listed :false});
  const dealOfDay = await products.find().limit(6);
  const category = await categories.find(); 
  res.render("user/index", {
    user: req.session.user,
    superDeal,
    dealOfDay,
    category, 
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
    const category = await categories.find(); 
    
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
    const product = await products.find().skip(skip).limit(limit);
    const category = await categories.find();

    res.render("user/product", {
      user: req.session.user,
      product,
      category,
      currentPage: page,
      totalPages: Math.ceil(productCount / limit),
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
      const productId = req.params.id; // extract the product ID from the query string
      const product = await products.findById({ _id: productId }); // find the product by ID using Mongoose
      console.log(product);
      res.render("user/details", { product }); // render the product-detail.ejs page and pass the product details
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  };




exports.checkout = (req, res) => {  ``
  res.render('user/checkout',)
}

exports.cart = (req, res) => {
  res.render('user/cart',)
}





exports.otplogin = (req, res) => {
  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.render('user/login-otp',)
}
