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

const collection = new mongoose.model("Collection1", LoginSchema);
const formcollection = new mongoose.model("FormCollection1", FormSchema);

module.exports ={collection,formcollection} ;
