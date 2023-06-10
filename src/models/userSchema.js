// define the schema

const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    phone: {
        type:String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    isBlocked: {
        type: Boolean,
        default:false
    },
    address: [{
        name: String,
        address: String,
        phone: Number,
        pincode: Number,
        city: String,
        state:String
    }],
    createdAt: {
    type: Date,
    default: Date.now
  }
});

const userDb = mongoose.model('customers', userSchema);
module.exports = userDb