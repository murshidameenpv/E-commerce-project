const userDb = require("../../models/userSchema");
const bcrypt = require('bcrypt');



                  /*Checks password Format when signing up*/
exports.passwordRegex = async (req, res, next)=>{
  const { password } = req.body;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    try {
        if (!passwordPattern.test(password)) {
          req.session.message = {
                      field: 'password',
                       msg: 'Password must contain at least one letter, one number, and be at least 4 characters long'
                     };
          return res.redirect("/signup");
        }
        next()
    }  
    catch (err) {
    console.error('Error checking password type', err);
    res.status(500).send('Internal Server Error');
  }
};




              /*Checks phone number Format when signing up*/
exports.phoneNumberRegex = async (req, res, next) => {
  const { phone } = req.body;
const phonePattern = /^\+91[0-9]{10}$/;

    try {
        if (!phonePattern.test(phone)) {
          req.session.message = {
                      field: 'phone',
                       msg: 'Invalid Phone Number'
                     };
          return res.redirect("/signup");
        }
        next()
    }  
    catch (err) {
    console.error('Error checking password type', err);
    res.status(500).send('Internal Server Error');
  }
};


                        /*Checks password is matching when signing up*/ 
exports.passwordMatch = (req, res, next) => {
    const data = req.body
    try {
        if (data.password !== data.confirm_password) {
        req.session.message = {
            field: 'password_match',
            msg: "Password didn't match"            
    }
       return res.redirect('/signup');
        }
     next()
  }
    catch (err) {
    console.error('Error checking password match', err);
    res.status(500).send('Internal Server Error');
  }
};







                /* Checks Email is Exist or not when signing up*/ 
exports.checkEmailExists = async (req, res, next)=>{
const email = req.body.email;
    try {
        const existingUser = await userDb.findOne({ email: email });
        if (existingUser) {
          req.session.message = {
                 field: 'email',
                 msg: 'Email already exists'
         };
            return res.redirect("/signup")
        }
        next()
    }  
    catch (err) {
    console.error('Error checking user existence in MongoDB', err);
    res.status(500).send('Internal Server Error');
  }
};


            /*Checks phone number exist or not when signing up*/ 
exports.checkPhoneNumberExistSignup = async (req, res, next)=>{
  const { phone } = req.body
  const data = req.session.phone = req.body
    try {
        const existingUser = await userDb.findOne({ phone });
        if (existingUser) {
          req.session.message = {
                 field: 'phone',
                 msg: 'User Exists with this phone number'
         };
            return res.redirect("/signup")
        }
        next()
    }  
    catch (err) {
    console.error('Error checking user existence in MongoDB', err);
    res.status(500).send('Internal Server Error');
  }
};






                  /*Checks email and password is exist or not when login*/ 
exports.checkUserExists = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userData = await userDb.findOne({ email });
    if (!userData) {
      req.session.message = {
        field: 'user',
        msg: 'Email not found'
      };
      return res.redirect("/login");
    }
    if (userData.isBlocked) {
      req.session.message = {
        field: 'user',
        msg: 'User is blocked'
      };
      return res.redirect("/login");
    }
    // Compare the entered password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      req.session.message = {
        field: 'user',
        msg: 'Incorrect password'
      };
      return res.redirect("/login");
    }//session
    req.session.user = userData;
    next();
  }
  catch
  (err) {
    console.error('Error creating or checking user existence in MongoDB', err);
    res.status(500).send('Internal Server Error');
  }
};


                  /*Checks phone number is exist or not when login with otp*/
exports.checkPhoneNumberExistOtp = async (req, res, next) => {
  const { phone } = req.body;
  const regex = /^\+91\d{10}$/;
  if (!regex.test(phone)) {
    return res.send("Invalid phone number");
  }
  try {
    const userData = await userDb.findOne({ phone });
    if (!userData) {
      return res.send("User not found with this number");
    }
    if (userData.isBlocked) {
      return res.send("User is Blocked");
    }
    next();
  } catch (err) {
    console.error("Error checking user existence in MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};
