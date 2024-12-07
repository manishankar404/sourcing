const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/LoginSignup")
mongoose.connect("mongodb+srv://manishankar:mani1430fire@sourcing.z6c6p.mongodb.net/?retryWrites=true&w=majority&appName=sourcing")
    .then(() => {console.log("MongoDB connected");})
    .catch((err) => {console.log("Failed to connect:", err);});
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // URL for the product image
    category: { type: String, required: true },});
const LoginSchema = new mongoose.Schema({
    email: {type: String,required: true},
    password: {type: String,required: true},
    petName: { type: String,required: true},// New field for security question
    fullName: { type: String }, // New field for full name
    companyName: { type: String }, // New field for company name
    website: { type: String }, // New field for website
    phone: { type: String },}); // New field for phone

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
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            logo: { type: String } // Path to uploaded logo
        }
    ],
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection1', required: true },
    status: { type: String, default: 'Pending' } // Add status field with a default value
});
const AdminLoginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});
const adminCollection = new mongoose.model("AdminCollection", AdminLoginSchema);
const Order = new mongoose.model("Order", OrderSchema);
const tempPasswordReset = new mongoose.model("TempPasswordReset", tempPasswordResetSchema);
const collection = new mongoose.model("Collection1", LoginSchema);
const Product =new mongoose.model('Product', ProductSchema);
module.exports = { collection, tempPasswordReset, Product,Order,adminCollection };