const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    displayName: { type: String },
    // selectedImage holds EITHER a preset key/path (e.g. "/images/Bust/peep-3.png")
    // OR an absolute Cloudinary URL for a custom-uploaded avatar.
    selectedImage: { type: String },
    // Cloudinary publicId for a custom avatar (used to delete/replace the asset).
    // Absent when the avatar is a preset.
    avatarPublicId: { type: String },
    onlineStatus: { type: String },
    statusMood: { type: String },
    hobbies: { type: Object },
    pronoun: { type: String },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
