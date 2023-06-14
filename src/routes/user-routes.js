const express = require('express');
const router = express.Router();
const userRender = require('../services/user-render');
const userController = require('../controllers/user-controller')
const validation = require('../middleware/user/validateUser')
const twilio = require('../services/twilio')


//GET METHODS
router.get('/', userRender.home);
router.get('/home', userRender.home);   
router.get('/aboutUs', userRender.aboutUs);
router.get('/products',userRender.products)
router.get('/contactUs',userRender.contactUs)
router.get('/login', userRender.login)
router.get('/signup', userRender.signup)
router.get('/checkout', userRender.checkout)
router.get('/cart', userRender.checkout)
router.get('/otplogin', userRender.otplogin)

 


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
router.post('/logout', userController.userLogout)

//twilio apis

router.post('/send-otp',
    validation.checkPhoneNumberExistOtp,
    twilio.sendOTP
);
router.post('/verify',twilio.verifyOTP)


module.exports = router;