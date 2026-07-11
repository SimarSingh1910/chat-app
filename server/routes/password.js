const express = require("express");
const { forgotPassword, resetPassword } = require("../controllers/password");

const router = express.Router();

// PUBLIC routes — no auth middleware (same as /login and /signup).
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
