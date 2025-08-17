const express = require("express");
const router = express.Router();
const {
  getProfile,
  postProfile,
  deleteProfile,
} = require("../controllers/profile");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, getProfile);
router.post("/", authenticateToken, postProfile);
router.delete("/:id", authenticateToken, deleteProfile);

module.exports = router;
