const mongoose = require("mongoose");
const { collection } = require("./mongodb"); // Adjust the path as needed

// Connect to the database
mongoose.connect("mongodb://localhost:27017/LoginSignup", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Failed to connect to MongoDB:", err));

// Define the admin user
const adminUser = {
    email: "admin@example.com",
    password: "securepassword", // Hash the password in production
    role: "admin" // Make sure your schema supports this field
};

async function addAdmin() {
    try {
        // Check if admin user already exists
        const existingAdmin = await collection.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log("Admin user already exists");
        } else {
            // Insert the admin user
            await collection.create(adminUser); // Use Mongoose's `create` method
            console.log("Admin user added successfully");
        }
    } catch (err) {
        console.error("Error adding admin user:", err);
    } finally {
        mongoose.disconnect(); // Close the database connection
    }
}

// Call the function
addAdmin();
