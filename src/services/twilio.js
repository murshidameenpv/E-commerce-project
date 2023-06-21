const userDb = require("../models/userSchema");
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await client.verify
      .v2.services(verifySid)
      .verifications.create({ to: phone, channel: 'sms' });

    if (verification.status === 'pending') {
      res.send('OTP sent successfully'); // Send a simple text response
    } else {
      res.send('Failed to send OTP'); // Send a simple text response
    }
  } catch (error) {
    console.error('Error sending OTP', error);
    res.send("Error sending OTP"); // Send a simple text response
  }
};




exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  console.log(phone,"oooooooooooo");
  console.log(otp,"oooooopppppppppppoooooo");
  const userData = await userDb.findOne({ phone });
  try {
    const verificationResult = await client.verify
      .v2.services(verifySid)
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationResult.status === 'approved') {
      //session
      req.session.user = userData;
         return res.redirect('/home');
    } else {
      // OTP verification failed
      res.render('user/login-otp', { message: 'Incorrect OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP', error);
    res.render('user/login-otp', { message: 'Error verifying OTP'});
  }
};
