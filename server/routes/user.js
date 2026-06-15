const express = require("express");
const router = express.Router();
const { searchUsers, getUserById } = require("../controllers/user");
const authenticateToken = require("../middleware/auth");

router.get("/search", authenticateToken, searchUsers);
router.get("/:id", authenticateToken, getUserById);

module.exports = router;
