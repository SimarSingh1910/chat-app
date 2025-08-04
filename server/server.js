const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

require("dotenv").config();
require("./passport");

const connectDB = require("./connection");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const profileRouter = require("./routes/profile");
const { generateToken } = require("./token");

const app = express();

const PORT = process.env.PORT || 3000;
const URL = process.env.MONGODB_URL;

// Connect to MongoDB
connectDB(URL);

// Middleware
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    res.redirect(`http://localhost:5173/`);
  }
);
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("token");
    res.redirect("/login");
  });
});


// Routes
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/profile", profileRouter);


app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
