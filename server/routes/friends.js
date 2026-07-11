const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  unfriend,
  getFriends,
  getRequests,
} = require("../controllers/friends");

// All friend routes require authentication (req.user.userId).
router.get("/", authenticateToken, getFriends);
router.get("/requests", authenticateToken, getRequests);
router.post("/request", authenticateToken, sendRequest);
router.post("/accept", authenticateToken, acceptRequest);
router.post("/reject", authenticateToken, rejectRequest);
router.post("/cancel", authenticateToken, cancelRequest);
router.delete("/:userId", authenticateToken, unfriend);

module.exports = router;
