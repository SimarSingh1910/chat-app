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
    selectedImage: { type: String },
    onlineStatus: { type: String },
    statusMood: { type: String },
    hobbies: { type: Object },
    pronoun: { type: String },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
