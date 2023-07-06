const crypto = require("crypto");
const bcrypt = require("bcrypt");
const userDb = require("../models/userSchema");
const cartDb = require("../models/cartSchema");

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
      const tokenExpiration = Date.now() + 30000;  ;
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


//ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.session.user._id;
    let cart = await cartDb.findOne({ userId });
    if (!cart) {
      // If the cart doesn't exist, create a new one and add the product
      cart = new cartDb({ userId, products: [{ productId, quantity }] });
    } else {
      // Check if the product is already in the cart
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );
      if (productIndex !== -1) {
        // The product is already in the cart, update its quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // The product is not in the cart, add it
        cart.products.push({ productId, quantity });
      }
    }
    await cart.save();
   res.json({
     message: "Added to Cart",
     cart: cart,
   });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product to the cart");
  }
};

//DELETE FROM CART
exports.deleteFromCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { productId } = req.body;
    await cartDb.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } }
    );
    res.json({ message: "Removed from Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting from cart");
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
      const userCart = await cartDb.findOne({ userId });

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

