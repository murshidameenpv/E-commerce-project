const mongoose = require("mongoose");

var couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },

  discount: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  minAmount: {
    type: Number,
    required:true
  },
  maxAmount: {
    type: Number,
    required:true
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },

  expiryDate: {
    type: Date,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

const couponDb =  mongoose.model("coupons", couponSchema);
module.exports = couponDb