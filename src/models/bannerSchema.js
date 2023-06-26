const mongoose = require("mongoose");

var bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
});

const bannerDb = mongoose.model("banners", bannerSchema);
module.exports = bannerDb;
