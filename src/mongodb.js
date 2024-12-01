const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/LoginSignup")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("Failed to connect:", err);
    });


const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // URL for the product image
    category: { type: String, required: true },
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
const OrderSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        }
    ],
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});
const AdminLoginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});
const adminCollection = new mongoose.model("AdminCollection", AdminLoginSchema);
const Order = new mongoose.model("Order", OrderSchema);
const tempPasswordReset = new mongoose.model("TempPasswordReset", tempPasswordResetSchema);
const collection = new mongoose.model("Collection1", LoginSchema);
const formcollection = new mongoose.model("FormCollection1", FormSchema);
const Product =new mongoose.model('Product', ProductSchema);
module.exports = { collection, formcollection, tempPasswordReset, Product,Order,adminCollection };

