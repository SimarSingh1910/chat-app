const User = require("../models/user");
const Profile = require("../models/profile");

async function postProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { username, ...profileFields } = req.body;
    if (username) {
      profileFields.displayName = username; // Sync displayName with username
    }
    const updated = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: profileFields },
      { new: true, runValidators: true, upsert: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Profile not found" });
    }

    if (username) {
      await User.updateOne({ _id: req.user.userId }, { $set: { username } });
    }

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
    let profile = await Profile.findOne({ user: req.user.userId }).populate(
      "user",
      "first_name last_name username email"
    );
    if (!profile) {
      // Create profile if not exists
      profile = new Profile({
        user: req.user.userId,
        displayName: req.user.email.split("@")[0], // default
      });
      await profile.save();
      profile = await Profile.findOne({ user: req.user.userId }).populate(
        "user",
        "first_name last_name username email"
      );
    }
    const profileData = {
      ...profile.toObject(),
      first_name: profile.user?.first_name || "",
      last_name: profile.user?.last_name || "",
      username: profile.user?.username || "",
      email: profile.user?.email || "",
    };
    return res.json({ profile: profileData });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
async function deleteProfile(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Profile.findOneAndDelete({ _id: id });
    if (!deleted) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const user = await User.findOneAndDelete({ _id: deleted.user });
    if (user) {
      res.clearCookie("token");
    }
    return res.json({ success: "Profile deleted successfully" });
  } catch (err) {
    console.error("Error deleting profile:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
module.exports = { getProfile, postProfile, deleteProfile };
