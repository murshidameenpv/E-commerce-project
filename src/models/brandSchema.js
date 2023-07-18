const mongoose = require("mongoose");

var brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "categories",
  },
});

const brandDb = mongoose.model("brands", brandSchema);
module.exports = brandDb
