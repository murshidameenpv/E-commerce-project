const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  balance: {
    type: Number,
    default: 0.0,
  },
  transactions: [
    {
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
      walletUpdate: {
        type: String,
        enum: ["credited", "debited"],
        default: "credited",
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const walletDb = mongoose.model("wallets", walletSchema);
module.exports = walletDb;
