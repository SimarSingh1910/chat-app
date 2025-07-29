const mongoose = require("mongoose");

async function connectDB(URL) {
  try {
    const conn = await mongoose.connect(URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
