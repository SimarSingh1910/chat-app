const express = require("express");
const router = express.Router();
const { getProfile , postProfile } = require("../controllers/profile");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, getProfile);
router.post("/", authenticateToken, postProfile);

module.exports = router;
