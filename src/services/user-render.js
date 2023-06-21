const products = require("../models/productSchema");
const categories = require("../models/categorySchema")

exports.home = async(req, res) => { 
  const superDeal = await products.find().limit(8);
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
  const product = await products.find();
  const category = await categories.find();
  res.render("user/product", {
    user: req.session.user,
    product,
    category,
  });
}


exports.contactUs = async (req, res) => { 
  const category = await categories.find()
  res.render("user/contact", {
    user: req.session.user,
    category,
  });
}

  





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
