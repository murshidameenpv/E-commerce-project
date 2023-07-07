const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema(
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

      },
    ],
    // tracks when the wishlist was last modified
    modifiedOn: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);
const wishlistDb = mongoose.model("wishlists", wishlistSchema);
module.exports = wishlistDb;
