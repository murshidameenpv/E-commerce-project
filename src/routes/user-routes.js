const express = require('express');
const router = express.Router();
const userRender = require('../services/user-render');
const userController = require('../controllers/user-controller')
const validation = require('../middleware/user/validateUser')
const twilio = require('../services/twilio')
const checkSession = require('../middleware/user/checkSession')
const nodeMailer = require('../services/nodemailer')
//GET METHODS
router.get('/',
    checkSession.sessionExists,
    userRender.home);
router.get("/home",
  userRender.home);  
 
router.get( "/products",
  userRender.products
);

router.get("/contactUs",
  userRender.contactUs
);
router.get("/login", 
  userRender.login
);
router.get("/signup",
  checkSession.checkUserBlocked,
  userRender.signup
);
router.get("/checkout",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.checkout
);
  router.get(
    "/address/add",
    checkSession.sessionExists,
    checkSession.checkUserBlocked,
    userRender.addAddressPage
  );
router.get(
  "/address/update",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.updateAddressPage
);
router.get("/cart",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.cart
);

router.get('/wishlist',
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.wishlist
)
router.get('/login/otplogin',
  userRender.otplogin)
 
router.get('/login/forgotPassword',
  userRender.forgotPassword)

router.get("/login/resetPassword",
  userRender.resetPassword);
 
router.get('/products/details/:id',
    userRender.productDetails
)
router.get("/orders", 
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.myOrders
)
router.get("/wallet", 
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.myWallet
)
router.get(
  "/paypal-success/:addressId",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.paypalSuccessPage
);
router.get(
  "/paypal-fail",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.paypalFailPage
);

//POST METHODS

router.post('/signup',
    validation.checkEmailExists,
    validation.passwordRegex,
    validation.passwordMatch,
    validation.phoneNumberRegex,
    validation.checkPhoneNumberExistSignup,
    userController.userSignUp
);
router.post('/login',
    validation.checkUserExists,
    userController.userLogin,
);
router.post(
  "/logout",
  checkSession.sessionExists,
  userController.userLogout
);

//twilio apis

router.post("/send-otp",
  validation.checkPhoneNumberExistOtp,
  twilio.sendOTP
);
router.post("/verify",
    twilio.verifyOTP);

router.post("/login/forgotPassword",
  userController.forgotPassword,
  nodeMailer.sendResetEmail
);
router.post("/login/resetPassword",
  userController.resetPassword);

router.post("/product/addToCart",
  userController.addToCart);

router.post("/cart/product/remove",
  userController.removeFromCart);

router.post("/wishlist/product/addtowishlist",
  userController.addToWishlist);

router.post("/wishlist/product/remove",
  userController.removeFromWishlist);

router.post(
  "/address",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userController.showCurrentAddress
);

router.post("/address/add",
  userController.addAddress);

  router.delete("/address/delete/:addressId",
    userController.deleteAddress);

router.post("/address/update/:addressId",
  userController.updateAddress);
  
router.post("/checkout/coupon/apply",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userController.applyCouponCode);

  router.post(
    "/checkout/cod",
    checkSession.sessionExists,
    checkSession.checkUserBlocked,
    userController.codPlaceOrder
  );
  router.post(
    "/checkout/wallet",
    checkSession.sessionExists,
    checkSession.checkUserBlocked,
    userController.walletPlaceOrder
  );

  router.post(
    "/checkout/proceedToPaypal",
    checkSession.sessionExists,
    checkSession.checkUserBlocked,
    userController.proceedToPayPal
  );
  router.post(
    "/checkout/createRazorPayOrderInstance",
    checkSession.sessionExists,
    checkSession.checkUserBlocked,
    userController.createRazorPayOrderInstance
  );
  router.post(
    "/checkout/razorpayCreateOrder",
    checkSession.sessionExists,
    checkSession.checkUserBlocked,
    userController.razorpayCreateOrder
  );
  
router.post('/order/cancel',
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userController.cancelOrder);
router.post(
  "/order/return",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userController.returnOrder
);

module.exports = router;