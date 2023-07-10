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
router.get("/address",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.addressDetails
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

router.put("/address/update/:addressId",
  userController.updateAddress);

module.exports = router;