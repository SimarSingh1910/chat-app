const mongoose = require("mongoose");
const { Schema } = mongoose;

// Short-lived password-reset tokens. We store only a SHA-256 hash of the token
// (never the raw value); the raw token lives solely in the emailed link.
const PasswordResetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, index: true },

    // TTL index: MongoDB removes the doc once expiresAt passes (same pattern as
    // models/message.js). We also guard on expiresAt in the query, so an expired
    // token is rejected even before the sweep runs.
    expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

PasswordResetSchema.pre("validate", function (next) {
  // Only set expiry if it's a new document — 1 hour from now.
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model("PasswordReset", PasswordResetSchema);
