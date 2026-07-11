const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
} = require("../controllers/message");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, sendMessage);
router.get("/:conversationId", authenticateToken, getMessages);
router.put("/read/:conversationId", authenticateToken, markAsRead);

module.exports = router;
