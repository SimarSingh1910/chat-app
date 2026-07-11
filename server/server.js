const express = require("express");
const http = require("http");
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
const passwordRouter = require("./routes/password");
const profileRouter = require("./routes/profile");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");
const userRouter = require("./routes/user");
const { generateToken } = require("./token");
const { initSocket } = require("./socket");

const app = express();

const PORT = process.env.PORT || 3000;
const URL = process.env.MONGODB_URL;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Connect to MongoDB
connectDB(URL);

// Middleware
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: true, credentials: true }));
// Raised from the default (~100kb) to accept cropped avatar data URLs.
app.use(express.json({ limit: "5mb" }));
app.use("/images", express.static("public/images"));

// Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login`,
  }),
  async (req, res) => {
    const token = generateToken(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT expiry)
    });

    const user = await User.findById(req.user._id);
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.redirect(`${CLIENT_URL}/profile`);
    }
    res.redirect(`${CLIENT_URL}/`);
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
// Public password-reset routes (/forgot-password, /reset-password).
app.use("/", passwordRouter);
app.use("/profile", profileRouter);
app.use("/conversations", conversationRouter);
app.use("/messages", messageRouter);
app.use("/users", userRouter);

// HTTP server + Socket.io (real-time layer)
const server = http.createServer(app);
const io = initSocket(server);

// Make io available to REST controllers via req.app.get("io")
app.set("io", io);

server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
