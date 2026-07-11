const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const PasswordReset = require("../models/passwordReset");
const { sendMail } = require("../lib/mailer");

// Google-created accounts are seeded with this placeholder password, which the
// User pre('save') hook then bcrypt-hashes — so we can't compare the stored
// value as a literal. Detect google-only accounts by comparing the hash.
const GOOGLE_PLACEHOLDER = "google-oauth";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Same strength rule the signup form enforces: 8+ chars including uppercase,
// lowercase, a number and a special character.
const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

const sha256 = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

// POST /forgot-password { email }
// Always responds 200 with the same generic message so an attacker can't use it
// to discover which emails have accounts (no user enumeration).
async function forgotPassword(req, res) {
  const generic = {
    message: "If an account exists, a reset link has been sent.",
  };

  try {
    const { email } = req.body || {};
    if (!email) return res.status(200).json(generic);

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Only real, password-based accounts can reset. Skip google-only accounts:
    // they authenticate via Google and their stored password is just the hashed
    // placeholder, so there's no local password to reset. An account that has a
    // googleId AND a real (non-placeholder) password — i.e. a linked account —
    // stays resettable, since the compare below only matches the placeholder.
    let resettable = false;
    if (user && user.password) {
      const isGoogleOnly =
        user.googleId &&
        (await bcrypt.compare(GOOGLE_PLACEHOLDER, user.password));
      resettable = !isGoogleOnly;
    }

    if (resettable) {
      // Invalidate any earlier tokens so only the newest link works.
      await PasswordReset.deleteMany({ userId: user._id });

      const raw = crypto.randomBytes(32).toString("hex");
      await PasswordReset.create({ userId: user._id, tokenHash: sha256(raw) });

      const link = `${CLIENT_URL}/reset-password?token=${raw}`;
      const html = `
        <p>You requested a password reset.</p>
        <p>
          <a href="${link}">Click here to reset your password.</a>
          This link expires in 1 hour and can be used once.
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p style="color:#888;font-size:12px">${link}</p>
      `;
      await sendMail({
        to: user.email,
        subject: "Reset your password",
        html,
      });
    }

    return res.status(200).json(generic);
  } catch (err) {
    // Log for ops, but still return the generic response so failures don't leak
    // whether the email exists.
    console.error("Error in forgotPassword:", err);
    return res.status(200).json(generic);
  }
}

// POST /reset-password { token, password }
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) {
      return res
        .status(400)
        .json({ error: "Token and password are required." });
    }

    if (!STRONG_PASSWORD.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
    }

    const record = await PasswordReset.findOne({
      tokenHash: sha256(token),
      expiresAt: { $gt: new Date() },
    });
    if (!record) {
      return res
        .status(400)
        .json({ error: "This reset link is invalid or has expired." });
    }

    const user = await User.findById(record.userId);
    if (!user) {
      await PasswordReset.deleteOne({ _id: record._id });
      return res
        .status(400)
        .json({ error: "This reset link is invalid or has expired." });
    }

    // Assign the plaintext password; the User pre('save') hook bcrypt-hashes it.
    // (Do NOT hash here — that would double-hash and break login.)
    user.password = password;
    await user.save();

    // Single use: consume the token.
    await PasswordReset.deleteOne({ _id: record._id });

    return res.json({
      success: "Password has been reset. You can now log in.",
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { forgotPassword, resetPassword };
