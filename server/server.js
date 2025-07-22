const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./connection");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const app = express();

const PORT = process.env.PORT || 3000;
const URL = process.env.MONGODB_URL;
// Connect to MongoDB
connectDB(URL);

// Middleware
app.use(cors({origin: true, credentials: true})); 
app.use(express.json()); 

// Routes
app.use("/login", loginRouter); 
app.use("/signup", signupRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on PORT: ${PORT}`);
});
