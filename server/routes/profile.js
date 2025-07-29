const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profile");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, getProfile);

module.exports = router;
