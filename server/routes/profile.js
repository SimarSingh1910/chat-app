const express = require("express");
const router = express.Router();
const {
  getProfile,
  postProfile,
  deleteProfile,
  uploadProfileAvatar,
  deleteProfileAvatar,
} = require("../controllers/profile");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, getProfile);
router.post("/", authenticateToken, postProfile);

// Custom-avatar routes. These MUST be declared before the "/:id" route below,
// otherwise DELETE /profile/avatar would match "/:id" with id="avatar".
router.post("/avatar", authenticateToken, uploadProfileAvatar);
router.delete("/avatar", authenticateToken, deleteProfileAvatar);

router.delete("/:id", authenticateToken, deleteProfile);

module.exports = router;
