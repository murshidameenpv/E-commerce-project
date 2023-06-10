const mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },

});

const adminDb = mongoose.model('admins', adminSchema);
module.exports = adminDb