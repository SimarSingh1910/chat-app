const express = require("express");
const router = express.Router();
const {
  getConversations,
  createConversation,
} = require("../controllers/conversation");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, getConversations);
router.post("/", authenticateToken, createConversation);

module.exports = router;
