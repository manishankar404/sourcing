const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const {collection,formcollection,tempPasswordReset} = require("./mongodb");
const session = require("express-session");
const templatePath = path.join(__dirname, "../tempelates");

// Serve static files from the "public" directory
app.use(express.static('public'));


app.use(session({
    secret: "project_sourcing", // Replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 100000 } // Adjust session duration as needed
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

// Resource pages
app.get("/Sourcing_Guide", (req, res) => res.render("sourcing_guide"));
app.get("/Shipping", (req, res) => res.render("shipping"));
app.get("/Selling", (req, res) => res.render("selling"));

// About pages
app.get("/About_Sourcing", (req, res) => res.render("about_sourcing"));
app.get("/Pricing", (req, res) => res.render("pricing"));

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
        password: req.body.password,
        petName: req.body.petName // Save the pet name
    };

    try {
        await collection.insertMany([data]);
        res.render("home", { isLoggedIn: false });
    } catch (err) {
        res.status(500).send("Error during signup");
    }
});

// Login logic
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });

        if (check && check.password === req.body.password) {
            req.session.isLoggedIn = true; // Set session variable
            res.redirect("/"); // Redirect to the home page
        } else {
            res.send("Wrong password");
        }
    } catch (err) {
        res.send("Wrong details");
    }
});


// Forget Password
app.get("/forgot_password", (req, res) => res.render("forgot_password"));

// Forget Password Route
app.post("/forgot_password", async (req, res) => {
    const { email, petName, newPassword } = req.body;

    try {
        // Check if the user exists with the provided email and pet name
        const user = await collection.findOne({ email: email, petName: petName });

        if (!user) {
            return res.send("Incorrect details. Please try again.");
        }

        // Store email and pet name in the temporary collection
        await tempPasswordReset.create({ email, petName });

        // Update the password directly
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
    res.redirect("/"); // Redirect to the home page
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
