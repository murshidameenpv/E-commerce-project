const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  address: [
    {
      firstName: String,
      lastName: String,
      postalCode: Number,
      locality: String,
      city: String,
      state: String,
      addressLine: String,
      landmark: String,
      phoneNumber: Number,
      emailAddress:String
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const userDb = mongoose.model('customers', userSchema);
module.exports = userDb
