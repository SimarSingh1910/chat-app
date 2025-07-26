require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./passport");
const cors = require("cors");
const connectDB = require("./connection");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const app = express();

const PORT = process.env.PORT || 3000;
const URL = process.env.MONGODB_URL;
// Connect to MongoDB
connectDB(URL);

// Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Google Auth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect("/");
});
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
// Routes
app.use("/login", loginRouter);
app.use("/signup", signupRouter);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
