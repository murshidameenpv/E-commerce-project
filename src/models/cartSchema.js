const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
    },
    products: [
      {
        productId:mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,      
        },
        {
            type: Number,
            required: true,
            default:1
      }
        ],
     //indicates whether the cart is active or not.
    active: {
      type: Boolean,
      default: true,
    },
    // tracks when the cart was last modified
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
    discount: {
      type: Number,
      default: 0,
    },
    wallet: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("cart", cartSchema);
