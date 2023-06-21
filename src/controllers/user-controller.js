
const bcrypt = require('bcrypt');
var userDb = require('../models/userSchema')




//USER SIGNUP
exports.userSignUp = async (req, res) => {
  const data = req.body;
  try {
    //generates a salt for password hashing. A salt is a random value that is combined with the password before hashing to create a unique hash for each password.
    const salt = await bcrypt.genSalt(10)
     // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(data.password, salt)
    // Update the user data with the hashed password
    const userData = {
      ...data,
      password: hashedPassword
    };
    await userDb.create(userData);
    res.redirect(302, "/login");;
  }
  catch (err) {
    console.error('Error creating or checking user existence in MongoDB', err);
    res.status(500).send('Internal Server Error');
  }
}

exports.productDetails = async (req, res) => {
  const product = req.param
  try {
    
  } catch (error) {
    
  }
}






  //USER LOGIN
exports.userLogin = (req, res) => {
     res.redirect(302, "/home");;
}


//USER LOGOUT
exports.userLogout = (req, res) => {
   req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/home');
  });
}