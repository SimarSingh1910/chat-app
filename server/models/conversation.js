const mongoose = require("mongoose");
const { Schema } = mongoose;

const LastMessageSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    text: { type: String },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date },
    expiresAt: { type: Date }, // Important to keep this here for the UI check
  },
  { _id: false }
);

const ConversationSchema = new Schema(
  {
    // REFACTOR: Use an array. It simplifies queries to: { participants: userId }
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // Denormalized Unread Counts (Map of UserID -> Count)
    // When User A sends a message, you increment unreadCounts[UserB_ID]
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },

    lastMessage: { type: LastMessageSchema, default: null },

    ephemeral: { type: Boolean, default: true, immutable: true },
  },
  { timestamps: true }
);

// INDEXES
// 1. Efficient Inbox Load: Find my chats, sort by newest activity
ConversationSchema.index({ participants: 1, updatedAt: -1 });

// 2. Uniqueness (Prevent duplicate chats between same two people)
ConversationSchema.index({ participants: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
