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
app.get("/T_shirts", (req, res) => res.render("T_shirts"));
app.get("/Polo_Shirts", (req, res) => res.render("polo_shirts"));
app.get("/Shorts", (req, res) => res.render("shorts"));
app.get("/Tank_Tops", (req, res) => res.render("Tank_Tops"));
app.get("/Pants", (req, res) => res.render("pants"));
app.get("/Scarf", (req, res) => res.render("Scarf"));
app.get("/Socks", (req, res) => res.render("socks"));
app.get("/Gloves", (req, res) => res.render("gloves"));
app.get("/Hats", (req, res) => res.render("hats"));
app.get("/sweater", (req, res) => res.render("sweater"));

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


app.get("/submissions", async (req, res) => {
    try {
        // Using exec() to directly execute the query
        const submissions = await formcollection.find({}).exec();
        // console.log("Submissions fetched:", submissions); // Log the submissions
        
        res.render("submissions", { submissions });
    } catch (err) {
        console.error("Error fetching submissions:", err);
        res.status(500).send("Error retrieving submissions");
    }
});


// Signup logic
app.post("/signup", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    };

    await collection.insertMany([data]);

    res.render("home", { isLoggedIn: false });
});

// Login logic
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });

        if (check.password === req.body.password) {
            // Login success
            res.render("home", { isLoggedIn: true });
        } else {
            res.send("Wrong password");
        }
    } catch {
        res.send("Wrong details");
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
        companyName: req.body.companyName,
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
    console.log("Server running on http://localhost:3000");
});
