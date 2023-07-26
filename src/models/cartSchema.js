const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupons",
    },
  },
  { timestamps: true }
);
const cartDb = mongoose.model("carts", cartSchema);
module.exports = cartDb
