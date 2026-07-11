const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },

    // STATUS FLAGS
    // Delivered is tricky in HTTP; usually managed via Socket.io/Websockets acknowledgements
    delivered: { type: Boolean, default: false },
    readAt: { type: Date, default: null },

    expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

MessageSchema.pre("validate", function (next) {
  // Only set expiry if it's a new document
  if (this.isNew && !this.expiresAt) {
    // Set to 24 hours from now
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

// Index for pagination (scroll up to see history)
MessageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);
