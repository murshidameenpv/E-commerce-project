const nodemailer = require("nodemailer");
const {google} = require('googleapis')
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});
    
  exports.sendResetEmail = async (req, res) => {
    const email = req.body.email;
    const resetLink = `http://${req.headers.host}/login/resetPassword?token=${req.resetPasswordToken}`;
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Password Reset",
      text: `Please click on the following link to reset your password: ${resetLink}`,
      html: `<p>Please click on the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error sending email");
      } else {
        res.send("An email has been sent to " + email);
      }
    });
  };
