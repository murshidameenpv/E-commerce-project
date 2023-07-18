const mongoose = require("mongoose")
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const userDb = require("../models/userSchema");
const cartDb = require("../models/cartSchema");
const wishlistDb = require("../models/wishlistSchema");
const productDb = require("../models/productSchema");
const couponDb = require("../models/couponSchema")
const orderDb = require('../models/orderSchema')

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

exports.addToCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { productId, quantity } = req.body;
    // Check if the requested quantity is available in stock
    const product = await productDb.findById(productId);
    if (quantity > product.stock) {
      // If the requested quantity is more than the available stock, send an error response
      res.json({
        title: "Error!",
        message: "Enter a valid stock quantity",
        icon: "error",
      });
      return;
    }
    let cart = await cartDb.findOne({ userId, active: true });
    if (!cart) {
      // If the user has no cart, create a new cart and add the product
      cart = await cartDb.create({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      // If the user already has a cart, add the product to the cart
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );
      if (productIndex > -1) {
        // If the product is already in the cart, check if the total quantity is valid
        if (cart.products[productIndex].quantity + quantity > product.stock) {
          // If the total quantity is more than the available stock, send an error response
          res.json({
            title: "Error!",
            message: "Enter a valid stock quantity",
            icon: "error",
          });
          return;
        }
        // Update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        cart.products.push({ productId, quantity });
      }
      await cart.save();
    }
    // Send a SweetAlert JSON response
    res.json({
      title: "Success!",
      message: "Product added to cart",
      icon: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product to the cart");
  }
};



//DELETE FROM CART
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { productId } = req.body;
    
    await cartDb.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } }
    );
    let total = 0;
    const cartItems = await cartDb
      .findOne({ userId })
      .populate("products.productId");
    cartItems.products.forEach((product) => {
      total += product.productId.price * product.quantity;
    })
    res.json({ message: "Removed from Cart",total });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting from cart");
  }
};



exports.addToWishlist = async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.body.productId;
  try {
    const wishlist = await wishlistDb.findOne({ userId: userId });
    if (wishlist) {
      // User has a wishlist
      // Check if product is already in wishlist
      const productIndex = wishlist.products.findIndex(
        (product) => product.productId.toString() === productId
      );
      if (productIndex === -1) {
        // Product is not in wishlist
        // Add product to wishlist
        wishlist.products.push({ productId: productId });
        await wishlist.save();
        res.json({
          message: "Product added to wishlist",
          title: "Success!",
          icon: "success",
        });
      } else {
        // Product is already in wishlist
        res.json({
          message: "Product is already in wishlist",
          title: "Error!",
          icon: "error",
        });
      }
    } else {
      // User does not have a wishlist
      // Create a new wishlist for user and add product to it
      const newWishlist = new wishlistDb({
        userId,
        products: [{ productId: productId }],
      });
      await newWishlist.save();
      res.json({
        message: "Product added to wishlist",
        title: "Success!",
        icon: "success",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an issue adding the product to the wishlist",
      title: "Error!",
      icon: "error",
    });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const productId = req.body.productId;
  const userId = req.session.user._id;

  try {
    // Find the wishlist document associated with this userId
    const wishlist = await wishlistDb.findOne({ userId });
    // Update the wishlist document
    await wishlistDb.findByIdAndUpdate(wishlist._id, {
      $pull: { products: { productId } },
    });
    res.json({
      title: "Success!",
      message: "Removed from wishlist",
      icon: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(" Error Removing product from wishlist");
  }
};

exports.showCurrentAddress = async (req, res) => {
  const userId = req.session.user._id;
  const addressId = req.body.addressId;
   try {
    const result = await userDb.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$address" },
      { $match: { "address._id": new mongoose.Types.ObjectId(addressId) } },
      { $replaceRoot: { newRoot: "$address" } },
    ]);
     const address = result[0];
    res.json(address);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching address");
  }
}
exports.addAddress = async (req, res) => {
  const userId = req.session.user._id;
  const {
    firstName,
    lastName,
    postalCode,
    locality,
    city,
    state,
    addressLine,
    landmark,
    phoneNumber,
    emailAddress,
  } = req.body;
  try {
    const user = await userDb.findById(userId);
    if (user.address.length >= 2) {
      res.json({
        title: "Error!",
        message: "You can only have a maximum of two addresses",
        icon: "error",
      });
      return;
    }
    user.address.push({
      firstName,
      lastName,
      postalCode,
      locality,
      city,
      state,
      addressLine,
      landmark,
      phoneNumber,
      emailAddress,
    });
    await user.save();
    res.json({
      title: "Success!",
      message: "Address added",
      icon: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding address");
  }
};

exports.deleteAddress = async (req, res) => {
  const userId = req.session.user._id;
  const addressId = req.params.addressId;
  try {
    // Update the user's address array
    await userDb.updateOne(
      { _id: userId },
      { $pull: { address: { _id: addressId } } }
    );
    // Send a success response
    res.status(200).json({
      title: "Success!",
      message: "Address deleted successfully",
      icon: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting address");
  }
};


exports.updateAddress = async (req, res) => {
  console.log("api call")
  const userId = req.session.user._id;
  console.log(req.query.addressId);
  const addressId = req.params.addressId;
  const {
    firstName,
    lastName,
    postalCode,
    locality,
    city,
    state,
    addressLine,
    landmark,
    phoneNumber,
    emailAddress,
  } = req.body;
  try {
    // Update the user's address array
    await userDb.updateOne(
      { _id: userId, "address._id": addressId },
      {
        $set: {
          "address.$.firstName": firstName,
          "address.$.lastName": lastName,
          "address.$.postalCode": postalCode,
          "address.$.locality": locality,
          "address.$.city": city,
          "address.$.state": state,
          "address.$.addressLine": addressLine,
          "address.$.landmark": landmark,
          "address.$.phoneNumber": phoneNumber,
          "address.$.emailAddress": emailAddress,
        },
      }
    );
    // Send a success response
    res.status(200).json({
      title: "Success!",
      message: "Address updated successfully",
      icon: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating address");
  }
};


//APPLY COUPON
exports.applyCouponCode = async (req, res) => {
  const { couponCode, total } = req.body;
  const userId = req.session.user._id;
  try {
    // Check if the entered coupon code exists in the database
    const coupon = await couponDb.findOne({ code: couponCode });
    if (!coupon) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid Coupon" });
    }
    // Check if the total purchase amount is less than the minimum amount required to apply the coupon
    if (total < coupon.minAmount) {
      return res.status(200).json({
        success: false,
        message: `Minimum purchase amount is ${coupon.minAmount}`
      });
    }
    const userCart = await cartDb.findOne({ userId }).populate("coupon");
    if (userCart.coupon) {
      if (!coupon.isActive) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid Coupon" });
      } else if (userCart.coupon.code === couponCode) {
        return res
          .status(200)
          .json({ success: false, message: "Coupon already applied" });
      } else if (coupon.expiryDate < new Date()) {
        return res
          .status(200)
          .json({ success: false, message: "Coupon Expired" });
      } else {
        await cartDb.findOneAndUpdate({ userId }, { coupon: coupon._id });
        res.status(200).json({
          success: true,
          message: "Coupon applied successfully",
          discountAmount: coupon.discount,
        });
      }
    } else {
      // Check if the coupon is activated before adding it to the user's cart
      if (!coupon.isActive) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid Coupon" });
      }
      await cartDb.findOneAndUpdate({ userId }, { coupon: coupon._id });
      res.status(200).json({
        success: true,
        message: "Coupon applied successfully",
        discountAmount: coupon.discount,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    // Extract the body data from the request
    const { paymentMethod, addressId, netAmount } = req.body;
    // Extract userId from req.session.user._id
    const userId = req.session.user._id;
    // Create an order
    const order = new orderDb({
      user: userId,
      total: netAmount,
      status: "placed",
      payment_method: paymentMethod,
      address: addressId,
    });
    // Find the products in the cart using userId
    const cart = await cartDb.findOne({ userId });
    // Populate the quantity and add that product reference and quantity in cartDb to that items array
    for (const item of cart.products) {
      // Find the product price from product db using populate
      const product = await productDb.findById(item.productId);
      order.items.push({
        product: item.productId,
        quantity: item.quantity,
        price: item.quantity * product.price,
      });
      // Decrease the stock of the product by the quantity ordered
      product.stock -= item.quantity;
      await product.save();
    }
    // Save the order
    await order.save();
    // Delete the user's cart
    await cartDb.findOneAndDelete({ userId });
    res.status(200).json({
      success: true,
      message: "Order Placed Successfully",
      icon: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Placing Order");
  }
};

