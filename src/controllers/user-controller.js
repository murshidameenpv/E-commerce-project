const crypto = require("crypto");
const bcrypt = require("bcrypt");
var userDb = require("../models/userSchema");
const productDb = require("../models/productSchema");
const { log } = require("console");

//USER SIGNUP
exports.userSignUp = async (req, res) => {
  const data = req.body;
  try {
    //generates a salt for password hashing. A salt is a random value that is combined with the password before hashing to create a unique hash for each password.
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(data.password, salt);
    // Update the user data with the hashed password
    const userData = {
      ...data,
      password: hashedPassword,
    };
    await userDb.create(userData);
    res.redirect(302, "/login");
  } catch (err) {
    console.error("Error creating or checking user existence in MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};

//USER LOGIN
exports.userLogin = (req, res) => {
  res.redirect(302, "/home");
};

//USER LOGOUT
exports.userLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/home");
  });
};

//FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  try {
    const existingUser = await userDb.findOne({ email: email });
    if (!existingUser) {
      return res.send("Email Not Found");
    } else {
      // generate unique token
      const token = crypto.randomBytes(20).toString("hex");
      // set token expiration time to 3  minute from now
      const tokenExpiration = Date.now() + 300000;  ;
      // update user with token and expiration time
      existingUser.resetPasswordToken = token;
      existingUser.resetPasswordExpires = tokenExpiration;
      await existingUser.save();
      req.resetPasswordToken = token;
      next();
    }
  } catch (err) {
    console.error("Error checking Email existence in MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};

//RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userDb.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.send("Invalid or expired token");
    }
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.send("Password updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating password");
  }
};

