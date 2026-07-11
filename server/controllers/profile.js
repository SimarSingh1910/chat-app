const User = require("../models/user");
const Profile = require("../models/profile");
const { uploadAvatar, destroyAvatar } = require("../lib/cloudinary");

// Accepts data URIs like "data:image/png;base64,...."
const IMAGE_DATA_URI = /^data:image\/(png|jpe?g|webp|gif);base64,/i;
const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

async function postProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { username, ...profileFields } = req.body;

    if (username) {
      // Enforce username uniqueness up front (excluding the current user) so a
      // clash returns a friendly message instead of a generic 500 — and so we
      // don't update Profile.displayName while the User.username write fails.
      const taken = await User.findOne({
        username,
        _id: { $ne: req.user.userId },
      });
      if (taken) {
        return res.status(409).json({ error: "Username already taken" });
      }
      profileFields.displayName = username; // Sync displayName with username
    }

    // If the request changes selectedImage away from a custom Cloudinary avatar
    // (e.g. the user picked a preset), destroy the old cloud asset and clear its
    // publicId in the SAME update — so cleanup is atomic with the persisted
    // change and can't strand a dangling URL. Guarded so a request that omits
    // selectedImage (e.g. the username-only save) never touches the avatar.
    const existing = await Profile.findOne({ user: req.user.userId }).select(
      "selectedImage avatarPublicId"
    );
    const switchingAwayFromCustom =
      profileFields.selectedImage !== undefined &&
      existing?.avatarPublicId &&
      profileFields.selectedImage !== existing.selectedImage;
    if (switchingAwayFromCustom) {
      await destroyAvatar(existing.avatarPublicId); // best-effort
      profileFields.avatarPublicId = null;
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
    // Safety net for a race between the uniqueness check and the write.
    if (err.code === 11000) {
      return res.status(409).json({ error: "Username already taken" });
    }
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
// POST /profile/avatar { image: <base64 data URL> }
// Uploads a custom avatar to Cloudinary and points the profile at it. Protected
// route (uses req.user.userId); does NOT go through the general profile upsert.
async function uploadProfileAvatar(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { image } = req.body || {};
    if (!image || typeof image !== "string" || !IMAGE_DATA_URI.test(image)) {
      return res
        .status(400)
        .json({ error: "A valid image data URL is required." });
    }

    // Guard on decoded size (cropped avatars are small; the body limit is 5MB).
    const base64 = image.slice(image.indexOf(",") + 1);
    const bytes = Math.floor((base64.length * 3) / 4);
    if (bytes > MAX_AVATAR_BYTES) {
      return res.status(413).json({ error: "Image is too large (max 5MB)." });
    }

    // Clean up any previous cloud asset first (best-effort — never blocks).
    const existing = await Profile.findOne({ user: req.user.userId }).select(
      "avatarPublicId"
    );
    if (existing?.avatarPublicId) {
      await destroyAvatar(existing.avatarPublicId);
    }

    let uploaded;
    try {
      uploaded = await uploadAvatar(image, req.user.userId);
    } catch (err) {
      if (err.message === "avatar upload is not configured") {
        return res
          .status(503)
          .json({ error: "Avatar upload is not configured on the server." });
      }
      throw err;
    }

    const updated = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: { selectedImage: uploaded.url, avatarPublicId: uploaded.publicId } },
      { new: true, upsert: true }
    );

    return res.json({
      selectedImage: updated.selectedImage,
      avatarPublicId: updated.avatarPublicId,
    });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /profile/avatar
// Called when the user switches back to a preset — removes the old Cloudinary
// asset and clears avatarPublicId. selectedImage is set to the preset key by the
// client's normal save flow.
async function deleteProfileAvatar(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const profile = await Profile.findOne({ user: req.user.userId });
    if (profile?.avatarPublicId) {
      await destroyAvatar(profile.avatarPublicId); // best-effort
      profile.avatarPublicId = undefined;
      await profile.save();
    }
    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting avatar:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getProfile,
  postProfile,
  deleteProfile,
  uploadProfileAvatar,
  deleteProfileAvatar,
};
