const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  selectedImage: {
    type: String,
  },
  onlineStatus: {
    type: String,
  },
  statusMood: {
    type: String,
  },
  hobbies: {
    type: Object,
  },
  pronoun: {
    type: String,
  },
});
const Profile = mongoose.model("profiles", profileSchema);
module.exports = Profile;
