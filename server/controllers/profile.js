const User = require("../models/user");
const Profile = require("../models/profile");

async function postProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const updated = await Profile.findOneAndUpdate(
      { email: req.user.email }, 
      { $set: req.body }, 
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await User.updateOne(
      { email: req.user.email },
      { $set: { profile_created: true } }
    );

    res.send({ success: "Profile updated successfully" });
  } catch (err) {
    console.error("Error saving profile:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function getProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const profile = await Profile.findOne({ email: req.user.email });
    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ profile });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getProfile, postProfile };
