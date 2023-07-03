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
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.home);   
router.get(
  "/aboutUs",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.aboutUs
);
router.get(
  "/products/:page?",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.products
);
router.get(
  "/contactUs",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.contactUs
);
router.get(
  "/login", 
  userRender.login
);
router.get(
  "/signup",
  checkSession.checkUserBlocked,
  userRender.signup
);
router.get(
  "/checkout",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.checkout
);
router.get(
  "/cart",
  checkSession.sessionExists,
  checkSession.checkUserBlocked,
  userRender.cart
);
router.get('/login/otplogin',
  userRender.otplogin)
 
router.get('/login/forgotPassword',
  userRender.forgotPassword)

router.get("/login/resetPassword",
  userRender.resetPassword);
 
router.get('/products/details/:id',
    userRender.productDetails
)

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

router.post(
  "/send-otp",
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
  userController.deleteFromCart);


module.exports = router;