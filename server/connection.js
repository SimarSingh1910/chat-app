const mongoose = require("mongoose");

async function connectDB(URL) {
    console.log("Connected to MongoDB...");
    return mongoose.connect(URL);
}

module.exports = connectDB;
