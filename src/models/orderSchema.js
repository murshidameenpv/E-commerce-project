const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Rejected",
      "Returned",
      "Refunded",
    ],
    required: true,
  },

  payment_method: {
    type: String,
    enum:['cod','paypal','razorpay'],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  address: {
    type: Object,
    required: true,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },

  reason: {
    type: String,
  },
});

const orderDb = mongoose.model("orders", orderSchema);
module.exports = orderDb;
