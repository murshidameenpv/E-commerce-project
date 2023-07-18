const mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
});

const categoryDb = mongoose.model("categories", categorySchema);
module.exports = categoryDb;

