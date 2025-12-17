const mongoose = require("mongoose");
const User = require("./models/user");
const Profile = require("./models/profile");
const Conversation = require("./models/conversation");
const Message = require("./models/message");
require("dotenv").config();

async function migrate() {
  await mongoose.connect(
  );

  // Create collections for conversations and messages
  await mongoose.connection.db.createCollection("conversations");
  await mongoose.connection.db.createCollection("messages");

  // For each Profile, find matching User by email and set user ref
  const profiles = await Profile.find({});
  for (const profile of profiles) {
    const user = await User.findOne({ email: profile.email });
    if (user) {
      profile.user = user._id;
      await profile.save();
      // Optionally remove duplicated fields from Profile if not needed
      // profile.first_name = undefined; etc., then save
    }
  }

  // Optionally, remove duplicated fields from User docs if moving to Profile
  // const users = await User.find({});
  // for (const user of users) { /* remove fields */ }

  console.log("Migration complete");
  process.exit();
}
migrate();
