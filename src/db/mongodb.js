const mongoose = require('mongoose')
const dotenv = require("dotenv").config({ path: '.env' });



const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})//returns a promise
    .then(() => {
        console.log("Mongo DB Connected");
    })
    .catch((error) => {
        console.log(error);
    })