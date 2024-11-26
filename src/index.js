const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const {collection,formcollection} = require("./mongodb");

const templatePath = path.join(__dirname, "../tempelates");

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

// Render home page
app.get("/", (req, res) => {
    res.render("home", { isLoggedIn: false });
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
app.get("/contact", (req, res) => res.render("contact"));
app.get("/form", (req, res) => res.render("form"));
app.get("/confirmation", (req, res) => res.render("confirmation"));

// Individual product pages
app.get("/Hoodies", (req, res) => res.render("hoodies"));
app.get("/Jackets", (req, res) => res.render("jackets"));
app.get("/T_shirts", (req, res) => res.render("tshirts"));
app.get("/Polo_Shirts", (req, res) => res.render("poloshirts"));
app.get("/Shorts", (req, res) => res.render("shorts"));
app.get("/Tank_Tops", (req, res) => res.render("tanktops"));
app.get("/Sportswear", (req, res) => res.render("sportswear"));
app.get("/Pants", (req, res) => res.render("pants"));
app.get("/Jeans", (req, res) => res.render("jeans"));
app.get("/Leggings", (req, res) => res.render("leggings"));
app.get("/Scarves", (req, res) => res.render("scarves"));
app.get("/Socks", (req, res) => res.render("socks"));
app.get("/Gloves", (req, res) => res.render("gloves"));
app.get("/Hats", (req, res) => res.render("hats"));

// Individual service pages
app.get("/Dropshipping", (req, res) => res.render("dropshipping"));
app.get("/Private_Label_Service", (req, res) => res.render("private_label_service"));
app.get("/Packing", (req, res) => res.render("packing"));
app.get("/Others", (req, res) => res.render("others"));

// Resource pages
app.get("/Sourcing_Guide", (req, res) => res.render("sourcing_guide"));
app.get("/Suppliers", (req, res) => res.render("suppliers"));
app.get("/Shipping", (req, res) => res.render("shipping"));
app.get("/Selling", (req, res) => res.render("selling"));

// About pages
app.get("/About_Sourcing", (req, res) => res.render("about_sourcing"));
app.get("/Pricing", (req, res) => res.render("pricing"));
app.get("/Products_We_Source", (req, res) => res.render("products_we_source"));
app.get("/How_We_Source_Suppliers", (req, res) => res.render("how_we_source_suppliers"));

app.get("/admin", async (req, res) => {
    try {
        // Simulate authentication (replace with proper session-based auth later)
        const admin = await collection.findOne({ email: req.query.email, role: "admin" });

        if (!admin) {
            return res.status(403).send("Access denied");
        }

        // Fetch submissions
        const submissions = await formcollection.find({}).toArray();
        res.render("admin", { submissions });
    } catch (err) {
        res.status(500).send("Error retrieving submissions");
    }
});


// Signup logic
app.post("/signup", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        role: "user" // Default to 'user'
    };

    try {
        await collection.insertOne(data);
        res.render("home", { isLoggedIn: false });
    } catch (err) {
        res.status(500).send("Signup failed");
    }
});



// Login logic
app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ email: req.body.email });

        if (user && user.password === req.body.password) {
            if (user.role === 'admin') {
                // Redirect to admin page
                res.redirect("/admin");
            } else {
                // Redirect to user home page
                res.render("home", { isLoggedIn: true });
            }
        } else {
            res.send("Invalid email or password");
        }
    } catch (err) {
        res.status(500).send("Login error");
    }
});


// Logout logic
app.get("/logout", (req, res) => {
    res.render("home", { isLoggedIn: false });
});

// form submission logic
app.post("/form", async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        website: req.body.website,
        serviceIntersted: req.body.service, // service is an array
        message: req.body.message
    };

    try {
        // Insert the form data into the database
        await formcollection.insertMany([data]);

        // Redirect to the confirmation page after successful submission
        res.redirect('/confirmation');
    } catch (err) {
        // Handle any errors, e.g., database issues
        res.status(500).send("Error in form submission. Please try again.");
    }
});


app.listen(3000, () => {
    console.log("Port connected");
});
