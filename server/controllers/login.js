const User = require("../models/user");

async function LoginUser(req, res) {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);
  res.send({ success: true });
}

module.exports = { LoginUser };
