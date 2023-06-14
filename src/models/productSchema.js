const mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required:true,
    },
    category: {
        type: String,
        required: true,
        ref:'category'
    },
    description: {
        type: String,
        required:true
    },
    price: {
        type: Number,
        required: true,
        min:0
    },
    stock: {
        type: Number,
        required: true,
    },
    image: {
        type:[String]   ,
        required:true
    },
    listed: {
        type: Boolean,
        required:true
    }
});

const productDb = mongoose.model('products', productSchema);
module.exports = productDb