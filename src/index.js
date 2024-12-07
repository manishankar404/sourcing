const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const {collection,tempPasswordReset,Product,Order,adminCollection} = require("./mongodb");
const session = require("express-session");
const multer = require('multer');
const templatePath = path.join(__dirname, "../tempelates");
// Serve static files from the "public" directory
app.use(express.static('public'));
hbs.registerHelper('multiply', (a, b) => a * b);
hbs.registerHelper("eq", (a, b) => a === b);
app.use(session({
    secret: "project_sourcing", // Replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000000 } // Adjust session duration as needed
}));
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false; // Default to false if not logged in
    next();
});
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
// Render home page
app.get("/", (req, res) => {
    res.render("home");
});
// Render login page
app.get("/login", (req, res) => {
    res.render("login");
});
// Render signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});
// Routes for pages
app.get("/products", (req, res) => res.render("products"));
app.get("/services", (req, res) => res.render("services"));
app.get("/resources", (req, res) => res.render("resources"));
app.get("/about", (req, res) => res.render("about"));
app.get("/form", (req, res) => res.render("form"));
app.get("/confirmation", (req, res) => res.render("confirmation"));
// Individual product pages
app.get("/Hoodies", async (req, res) => {
    try {
        const products = await Product.find({ category: "Hoodies" }); // Fetch only hoodies
        res.render("Hoodies", { products });
    } catch (err) {
        console.error("Error fetching hoodies:", err);
        res.status(500).send("Error fetching hoodies: " + err);
    }
});
app.get("/Jackets", async (req, res) => {
    try {
        const products = await Product.find({ category: "Jackets" }); // Fetch only jackets
        res.render("Jackets", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/sweater", async (req, res) => {
    try {
        const products = await Product.find({ category: "Sweaters" }); // Fetch only sweater
        res.render("sweater", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/Polo_Shirts", async (req, res) => {
    try {
        const products = await Product.find({ category: "Polo_Shirts" }); // Fetch only Polo_Shirts
        res.render("Polo_Shirts", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/T_shirts", async (req, res) => {
    try {
        const products = await Product.find({ category: "T_Shirts" }); // Fetch only T_shirts
        res.render("T_shirts", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/Tank_Tops", async (req, res) => {
    try {
        const products = await Product.find({ category: "Tank_Tops" }); // Fetch only Tank_Tops
        res.render("Tank_Tops", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/pants", async (req, res) => {
    try {
        const products = await Product.find({ category: "Pants" }); // Fetch only pants
        res.render("pants", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/shorts", async (req, res) => {
    try {
        const products = await Product.find({ category: "Shorts" }); // Fetch only shorts
        res.render("shorts", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/socks", async (req, res) => {
    try {
        const products = await Product.find({ category: "Socks" }); // Fetch only socks
        res.render("socks", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/hats", async (req, res) => {
    try {
        const products = await Product.find({ category: "Hats" }); // Fetch only hats
        res.render("hats", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/Scarf", async (req, res) => {
    try {
        const products = await Product.find({ category: "Scarf" }); // Fetch only Scarf
        res.render("Scarf", { products });
    } catch (err) {
        console.error("Error fetching jackets:", err);
        res.status(500).send("Error fetching jackets: " + err);
    }
});
app.get("/gloves", async (req, res) => {
    try {
        const products = await Product.find({ category: "Gloves" }); // Fetch only gloves
        res.render("gloves", { products });
    } catch (err) {
        console.error("Error fetching gloves:", err);
        res.status(500).send("Error fetching gloves: " + err);
    }
});
// Individual service pages
app.get("/Dropshipping", (req, res) => res.render("dropshipping"));
app.get("/Private_Label_Service", (req, res) => res.render("private_label_service"));
app.get("/Packing", (req, res) => res.render("packing"));
// Resource pages
app.get("/Sourcing_Guide", (req, res) => res.render("sourcing_guide"));
app.get("/Shipping", (req, res) => res.render("shipping"));
app.get("/Selling", (req, res) => res.render("selling"));
// About pages
app.get("/About_Sourcing", (req, res) => res.render("about_sourcing"));
app.get("/Pricing", (req, res) => res.render("pricing"));
app.get("/submissions", async (req, res) => {
    if (!req.session.isAdminLoggedIn) {
        return res.redirect("/admin/login"); // Redirect immediately if not logged in
    }

    try {
        const submissions = await collection.find({}).exec(); // Fetch all submissions
        res.render("submissions", { submissions }); // Pass data to the view
    } catch (err) {
        console.error("Error fetching submissions:", err);
        res.status(500).send("Error retrieving submissions"); // Send an error response
    }
});

// Signup logic
app.post("/signup", async (req, res) => {
    const { email, password, petName, fullName, companyName, website, phone } = req.body;
    // Ensure required fields are provided
    if (!email || !password || !petName) {
        return res.status(400).send("Missing required fields: email, password, and petName");
    }
    const data = { email, password, petName, fullName, companyName, website, phone };
    try {
        const user = new collection(data);  // Create a new document instance
        await user.save();
        res.redirect("/login"); // Redirect to login after successful signup
    }catch (err) {
        console.error("Error during signup:", err);
        res.status(500).send("An error occurred during signup: " + err.message);
    }    
});
// Login logic
app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ email: req.body.email });
        if (user && user.password === req.body.password) {
            req.session.isLoggedIn = true;
            req.session.email = user.email; // Store email in session
            return res.redirect("/profile");
        } else {
            res.send("Invalid email or password");
        }
    } catch (err) {
        res.status(500).send("Error during login: " + err.message);
    }
});
// Forget Password
app.get("/forgot_password", (req, res) => res.render("forgot_password"));
// Forget Password Route
// Forget Password Route
app.post("/forgot_password", async (req, res) => {
    const { email, petName, newPassword, confirmPassword } = req.body;
    // Validate that passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).send("Passwords do not match. Please try again.");
    }
    try {
        // Check if the user exists with the provided email and pet name
        const user = await collection.findOne({ email: email, petName: petName });
        if (!user) {
            return res.send("Incorrect details. Please try again.");
        }
        // Update the password
        user.password = newPassword;
        await user.save();
        res.send("Password successfully reset. You can now log in.");
    } catch (err) {
        console.error("Error during password reset:", err);
        res.status(500).send("Error resetting password");
    }
});
// Logout logic
app.get("/logout", (req, res) => {
    req.session.isLoggedIn = false; // Clear session variable
    res.redirect("/login"); // Redirect to the login page
});
// Add to cart
app.post('/cart/add', async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ message: 'Please log in to add items to your cart.' });
    }
    try {
        const { productId, quantity } = req.body;
        // Fetch product details using `await` in an async function
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Initialize cart if it doesn't exist
        if (!req.session.cart) req.session.cart = [];
        const cart = req.session.cart;
        const existingItem = cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += parseInt(quantity, 10);
        } else {
            cart.push({
                productId,
                quantity: parseInt(quantity, 10),
                name: product.name,
                price: product.price,
            });
        }
        req.session.cart = cart;
        res.json({ message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
});
// Get cart
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    res.render('cart', { cart, totalPrice });
});
// Remove from cart
app.post('/cart/remove', (req, res) => {
    try {
        const { productId } = req.body;
        if (!req.session.cart) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        res.json({ message: 'Item removed', cart: req.session.cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
});
// Display the order page
app.get('/order', (req, res) => {
    const cart = req.session.cart || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    res.render('order', { cart, totalPrice });
});
app.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'fullName email phone') // Fetch user details
            .populate('items.productId', 'name'); // Fetch product details
        res.render('admin-orders', { orders });
    } catch (err) {
        res.status(500).send("Error fetching orders: " + err.message);
    }
});
app.post('/admin/orders/update-status', async (req, res) => {
    const { orderId, status } = req.body;
    try {
        await Order.findByIdAndUpdate(orderId, { status });
        res.redirect('/admin/orders');
    } catch (err) {
        res.status(500).send("Error updating order status: " + err.message);
    }
});
// Set up storage destination and filename for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/img'); // Save the images inside the 'public/img' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on current timestamp
    },
  });
// Create multer instance with storage configuration
const upload = multer({ storage: storage });
// Set up storage destination and filename for logo uploads
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/logos'); // Directory for logo uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
// Create multer instance for logo uploads, handling an array of files
const upload2 = multer({ storage: storage2 });
app.post('/order', upload2.array('logos'), async (req, res) => {
    try {
        if (!req.session.isLoggedIn) {
            return res.status(401).json({ message: 'Please log in to place an order.' });
        }
        const cart = req.session.cart || [];
        if (cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Cannot place order.' });
        }
        const user = await collection.findOne({ email: req.session.email });
        // Map logos to the cart items
        const logos = req.files; // Multer gives you access to uploaded files through req.files
        const items = cart.map((item, index) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            logo: logos[index] ? `/uploads/logos/${logos[index].filename}` : null // Store logo path if uploaded
        }));
        const order = {
            items,
            total: cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
            date: new Date(),
            user: user._id,
            status: 'Pending' // Ensure that status is set when the order is created
        };
        const newOrder = new Order(order);
        await newOrder.save();
        req.session.cart = []; // Clear the cart after order is placed
        res.render('order-confirmation', { order: newOrder }); // Render the order confirmation page
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});
// Route to render admin product form
app.get('/admin/add-product', (req, res) => {
    res.render('admin-add-product'); // Create this template to render the form
});
// Route to handle form submission with image upload
app.post('/admin/add-product', upload.single('image'), async (req, res) => {
  const { name, price, category } = req.body;
  const imagePath = `/img/${req.file.filename}`; // The image URL that will be saved in MongoDB
  try {
    // Save product to the database
    const newProduct = new Product({
      name,
      price,
      image: imagePath,
      category,
    });
    await newProduct.save();
  } catch (err) {
    res.status(500).send("Error adding product: " + err);
  }
});
// Render admin login page
app.get("/admin/login", (req, res) => {
    res.render("admin-login");
});
// Admin login logic
app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await adminCollection.findOne({ username });
        if (admin && admin.password === password) {
            req.session.isAdminLoggedIn = true; // Set admin session
            res.redirect("/admin"); // Redirect to admin page
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        res.status(500).send("Error during admin login: " + error.message);
    }
});
// Admin dashboard
app.get("/admin", (req, res) => {
    if (req.session.isAdminLoggedIn) {
        res.render("admin"); // Render the admin dashboard
    } else {
        res.redirect("/admin/login"); // Redirect to admin login if not logged in
    }
});
// Admin logout
app.get("/admin/logout", (req, res) => {
    req.session.isAdminLoggedIn = false; // Clear session
    res.redirect("/admin/login"); // Redirect to admin login
});
app.get("/profile", async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    try {
        const user = await collection.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Fetch orders for the logged-in user
        const orders = await Order.find({ user: user._id })
            .populate('items.productId', 'name') // Populate product details
            .exec();

        res.render("profile", {
            fullName: user.fullName,
            email: user.email,
            companyName: user.companyName,
            website: user.website,
            phone: user.phone,
            orders // Pass orders to the view
        });
    } catch (err) {
        res.status(500).send("Error loading profile: " + err.message);
    }
});
app.get("/edit-profile", async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    try {
        const user = await collection.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("edit-profile", {
            fullName: user.fullName,
            email: user.email,
            companyName: user.companyName,
            website: user.website,
            phone: user.phone,
        });
    } catch (err) {
        res.status(500).send("Error loading edit profile: " + err.message);
    }
});
app.post("/edit-profile", async (req, res) => {
    const { fullName, companyName, website, phone } = req.body;
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    try {
        await collection.updateOne(
            { email: req.session.email },
            { $set: { fullName, companyName, website, phone } }
        );
        res.redirect("/profile");
    } catch (err) {
        res.status(500).send("Error updating profile: " + err.message);
    }
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
