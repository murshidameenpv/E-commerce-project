const  db  = require("../models/productSchema");

exports.home = async(req, res) => { 
    const superDeal =await db.find()
  res.render('user/index', {user:req.session.user, superDeal})
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



exports.aboutUs = (req, res) => {  
  if (req.session.user) {
    
  }
  res.render('user/about',{user:req.session.user})
}

exports.products = (req, res) => { 

  res.render('user/product',{user:req.session.user})
}


exports.contactUs = (req, res) => { 
  res.render('user/contact',{user:req.session.user})
}

  





exports.checkout = (req, res) => {
  res.render('user/checkout',)
}

exports.checkout = (req, res) => {
  res.render('user/cart',)
}





exports.otplogin = (req, res) => {
  res.header('Cache-Control', 'no-store');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.render('user/login-otp',)
}
