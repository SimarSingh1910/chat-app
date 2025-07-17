const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const loginRouter = require("./routes/login")
const app = express();
const PORT = 3000;
const URL = "mongodb://127.0.0.1:27017/ChatAppDB";


// Connect to MongoDB
connectDB(URL);

// Middleware
app.use(cors({origin: "http://localhost:5173", credentials: true})); 
app.use(express.json()); 

// Routes
app.use("/login", loginRouter); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
