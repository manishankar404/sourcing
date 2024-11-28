const mongoose = require("mongoose");



mongoose.connect("mongodb://localhost:27017/LoginSignup")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("Failed to connect:", err);
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
    petName: { // New field for security question
        type: String,
        required: true
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
    website:{
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

const tempPasswordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    petName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // Automatically delete after 10 minutes
    },
});

const tempPasswordReset = new mongoose.model("TempPasswordReset", tempPasswordResetSchema);
const collection = new mongoose.model("Collection1", LoginSchema);
const formcollection = new mongoose.model("FormCollection1", FormSchema);

module.exports ={collection,formcollection,tempPasswordReset} ;
