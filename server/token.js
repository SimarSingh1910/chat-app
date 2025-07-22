const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = { generateToken };
