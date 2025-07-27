async function getProfile(req, res) {
  // req.user is set by the auth middleware
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ user: req.user });
}

module.exports = { getProfile };