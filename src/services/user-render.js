  const productDb = require("../models/productSchema");
  const categoryDb = require("../models/categorySchema");
  const bannerDb = require("../models/bannerSchema")
  const brandDb = require("../models/brandSchema")
  const userDb = require('../models/userSchema')
  const cartDb = require('../models/cartSchema')
  const wishlistDb = require('../models/wishlistSchema')
  const orderDb = require('../models/orderSchema')
const walletDb = require('../models/walletSchema')
const paypal = require("paypal-rest-sdk");
  
  
  //RENDER HOME
exports.home = async(req, res) => { 
    const superDeal = await productDb.find({ listed: false, stock: { $gt: 0 } }).limit(8).populate('brand').exec();
    const dealOfDay = await productDb.find({ listed: false, stock: { $gt: 0 } }).limit(6).populate("brand").exec();
    const category = await categoryDb.find().exec();
    const todayOfferBanner = await bannerDb.findOne({ title: "Top Deal" });
    const topDealBanner = await bannerDb.findOne({title: "Today Offer",
    });
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
exports.login = async(req, res) => {
  if (req.session.user) {
    res.redirect('/home')
  } 
     let message = "";// Variable to store the message
  if (req.session.message) {
    message = req.session.message;
    delete req.session.message// Clear the message from the session
  }
    const category = await categoryDb.find();
  res.render('user/login', { message,category }); // Pass the message to the user-signup view
  }


//RENDER SIGNUP
exports.signup = async (req, res) => {
  const category = await categoryDb.find();
  let message = ""; 
  if (req.session.message) {
    message = req.session.message;
    delete req.session.message; 
  }
  res.render('user/signup', { message,category});
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
    const searchQuery = req.query.query ||"";
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
    const category = await categoryDb.find();
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
      category,
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


//render  delivery address address on text area 
const formatAddress = (address) => {
  return `${address.firstName} ${address.lastName},${address.addressLine},${address.locality}, ${address.city}, ${address.state}-${address.postalCode},${address.phoneNumber},${address.emailAddress}`;
};

exports.addAddressPage = async (req, res) => {
  const userId = req.session.user._id;
  try {
    res.render("user/addAddress", {
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

  exports.updateAddressPage = async (req, res) => {
    const userId = req.session.user._id;
    const addressId = req.query.addressId;
    try {
      const user = await userDb.findById(userId);
      // Find the user's address data using their userId and addressId
      const addressData = user.address.id(addressId);
      res.render("user/updateAddress", {
        user: req.session.user,
        addressData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  };




  exports.checkout = async (req, res) => {
    const userId = req.session.user._id;
    try {
      const category = await categoryDb.find();
      const { address } = await userDb.findById(userId);
      const userCart = await cartDb
        .findOne({ userId })
        .populate("coupon")
        .populate("products.productId");
      let total = 0;
      if (userCart) {
        userCart.products.forEach((product) => {
          total += product.productId.price * product.quantity;
        });
      } else {
        return res.redirect("/products");
      }
      let discount = 0;
      let couponCode = ""
      if (userCart.coupon) {
        couponCode = userCart.coupon.code
        if (total >= userCart.coupon.minAmount) {
          discount = total * (userCart.coupon.discount / 100);
          if (discount > userCart.coupon.maxAmount) {
            discount = userCart.coupon.maxAmount;
          }
        }
      }
      let netAmount = total - discount + 40;  
      res.render("user/checkout", {
        user: req.session.user,
        category,
        addressData: address.length > 0 ? address.map(formatAddress) : [],
        addressId: address ? address.map((address) => address._id) : [],
        couponCode,
        total,
        discount,
        netAmount,
      
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  };




exports.myOrders = async (req, res) => {
  try {
    const category = await categoryDb.find();
    const userId = req.session.user._id;
    // Find the orders of that user from the OrderDb
    const orders = await orderDb
      .find({ user: userId })
      .populate("items.product");

    res.render("user/orders", {
      user: req.session.user,
      orders,
      category
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.send("Internal server error");
  }
};

exports.myWallet = async (req, res) => {
      const userId = req.session.user._id;
  const wallet = await walletDb.findOne({ user: userId });
  const category = await categoryDb.find();
  try {
     const balance = wallet ? wallet.balance : 0;
     res.render("user/wallet", { user: req.session.user, balance,wallet ,category});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};



exports.paypalSuccessPage = async (req, res) => {
  try {
    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerID;
    const executePayment = {
      payer_id: payerId,
    };
    paypal.payment.execute(
      paymentId,
      executePayment,
      async function (error, payment) {
        if (error) {
          console.log(error);
          res.redirect("user/paypalError");
        } else {
          const addressId = req.params.addressId;
          const netAmount = req.query.netAmount;
          const userId = req.session.user._id;
          const user = await userDb.findById(userId);
          const address = user.address.find(
            (addr) => addr._id.toString() === addressId
          );
          // Create an order
          const order = new orderDb({
            user: userId,
            total: netAmount,
            status: "Placed",
            payment_method: "paypal",
            address: address,
          });
          const cart = await cartDb.findOne({ userId });
          if (!cart || cart.products.length === 0) {
            // Redirect the user to the /orders page
            res.redirect("/orders");
            return;
          } else {
            for (const item of cart.products) {
              const product = await productDb.findById(item.productId);
              order.items.push({
                product: item.productId,
                quantity: item.quantity,
                price: item.quantity * product.price,
              });
              product.stock -= item.quantity;
              await product.save();
            }
          }
          // Save the order
          await order.save();
          // Delete the user's cart
          await cartDb.findOneAndDelete({ userId });
          res.render("user/paypalSuccess", {
            user: req.session.user,
            paymentID: paymentId,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.paypalFailPage = (req, res) => {
  res.render("user/paypalError");
};

