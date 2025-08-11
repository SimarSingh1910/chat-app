const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../token");

async function LoginUser(req, res) {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);
  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: "Invalid password" });
    }

    const token = generateToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      })
      .send({ profile: user.profile_created });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = { LoginUser };
