const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const User = require("./models/user");
const Profile = require("./models/profile");

require("dotenv").config();
require("./passport");

const connectDB = require("./connection");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const profileRouter = require("./routes/profile");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");
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
app.use("/images", express.static("public/images"));

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
  async (req, res) => {
    const token = generateToken(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    const user = await User.findById(req.user._id);
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.redirect("http://localhost:5173/profile");
    }
    res.redirect("http://localhost:5173/");
  }
);
app.get("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("token");
    res.send({ success: true });
  });
});

// Routes
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/profile", profileRouter);
app.use("/conversations", conversationRouter);
app.use("/messages", messageRouter);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
