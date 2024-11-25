const express = require("express");
const path = require("path");
const URL = require("./models/url"); // Ensure this schema is correct
const { connectToMongoDB } = require("./connect.js");
const app = express();
const PORT = 8001;
const cookieParser = require('cookie-parser');
const {restrictToLoggedinUserOnly, checkAuth} = require('./middlewares/auth');

// Middleware for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter.js");
const userRoute = require('./routes/user.js');


app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/", checkAuth, staticRoute);
app.use("/user", userRoute);





// Test log for starting the server
console.log("HEYY testing my server");

// Connect to MongoDB and handle any potential errors
connectToMongoDB("mongodb://127.0.0.1:27017/URL-Shortener")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set EJS as the view engine and set the views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));



// Redirect shortId to the original URL and handle the case where entry is not found
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: { timestamp: Date.now() },
        },
      },
      { new: true } // Ensure we get the updated document
    );

    if (entry) {
      return res.redirect(entry.redirectURL); // Redirect if the entry is found
    } else {
      return res.status(404).send("URL not found"); // Handle case where shortId is not found
    }
  } catch (error) {
    console.error("Error in finding and updating shortId:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Start the server and log the port
app.listen(PORT, () => console.log("Server started at", PORT));
