const User = require("../models/user");
const { generateToken } = require("../token");

async function SignupUser(req, res) {
  const { first_name, last_name, username, email, password } = req.body;
  if (!first_name || !last_name || !username || !email || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ error: "User already exists" });
    }
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).send({ error: "Username already taken" });
    }
    const newUser = new User({
      first_name,
      last_name,
      username,
      email,
      password,
    });
    await newUser.save();

    const token = generateToken(newUser);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      })
      .send({ success: "User signed up successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = { SignupUser };
