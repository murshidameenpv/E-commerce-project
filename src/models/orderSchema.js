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
        "Returned",
        "Refunded",
      ],
      required: true,
    },

    payment_method: {
      type: String,
      enum: ["cod", "paypal", "wallet", "razorpay"],
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    returnedAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    address: {
      type: Object,
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
