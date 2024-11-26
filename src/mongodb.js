const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/LoginSignup")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(() => {
        console.log("Failed to connect");
    });

const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Only 'user' or 'admin' allowed
        default: 'user' // Default role is 'user'
    }
});
const FormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone:{
        type:String
    },
    companyName:{
        type:String
    },
    serviceIntersted:[{
        type:String
    }],
    message:{
        type:String,
        required:true
    }
});

const collection = new mongoose.model("Collection1", LoginSchema);
const formcollection = new mongoose.model("FormCollection1", FormSchema);

module.exports ={collection,formcollection} ;
