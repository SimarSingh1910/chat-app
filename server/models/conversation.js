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

    // Deterministic key for the participant pair (sorted ids joined by "_").
    // This is what enforces "one conversation per pair" — a unique index on the
    // `participants` array itself would be multikey and wrongly force each user
    // into a single conversation.
    participantsKey: { type: String, unique: true },

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

// 2. Uniqueness (Prevent duplicate chats between same two people) is enforced
//    by the `unique: true` on `participantsKey` above — NOT on the array, which
//    would be multikey and wrongly force each user into a single conversation.

module.exports = mongoose.model("Conversation", ConversationSchema);
