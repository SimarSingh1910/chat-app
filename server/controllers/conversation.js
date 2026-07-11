const Conversation = require("../models/conversation");
const User = require("../models/user");
const Profile = require("../models/profile");

// Attach each participant's profile avatar so the client can render the
// chat list without a second round of profile fetches.
async function attachAvatars(conversations) {
  const userIds = new Set();
  for (const conv of conversations) {
    for (const p of conv.participants) userIds.add(p._id.toString());
  }
  const profiles = await Profile.find({
    user: { $in: [...userIds] },
  }).select("user selectedImage statusMood pronoun");
  const byUser = new Map(profiles.map((p) => [p.user.toString(), p]));

  return conversations.map((conv) => {
    // flattenMaps so unreadCounts (a Map) serializes as a plain JSON object.
    const obj = conv.toObject({ flattenMaps: true });
    obj.participants = obj.participants.map((p) => {
      const profile = byUser.get(p._id.toString());
      return {
        ...p,
        avatar: profile?.selectedImage || null,
        statusMood: profile?.statusMood || "",
        pronoun: profile?.pronoun || "",
      };
    });
    return obj;
  });
}

async function getConversations(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const conversations = await Conversation.find({
      participants: req.user.userId,
    })
      .populate("participants", "username first_name last_name online")
      .populate("lastMessage.sender", "username")
      .sort({ updatedAt: -1 });

    res.json({ conversations: await attachAvatars(conversations) });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function createConversation(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { participantId } = req.body;
    if (!participantId) {
      return res.status(400).json({ error: "Participant ID required" });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    // Hard gate: a NEW conversation can only be started with a friend. Applies
    // to creation ONLY — existing conversations and messaging are grandfathered
    // (unfriending does not delete chats; messages self-expire in 24h).
    const self = await User.findById(req.user.userId).select("friends");
    const isFriend =
      self &&
      self.friends.some((f) => f.toString() === participantId.toString());
    if (!isFriend) {
      return res
        .status(403)
        .json({ error: "You can only start a chat with a friend" });
    }

    // Sort participants for a deterministic, pair-unique key
    const participants = [req.user.userId, participantId].map(String).sort();
    const participantsKey = participants.join("_");

    // Find existing or create new (atomic upsert avoids duplicate-pair races)
    let conversation = await Conversation.findOneAndUpdate(
      { participantsKey },
      { $setOnInsert: { participants, participantsKey } },
      { new: true, upsert: true }
    );

    // Populate and return
    conversation = await Conversation.findById(conversation._id)
      .populate("participants", "username first_name last_name online")
      .populate("lastMessage.sender", "username");

    const [enriched] = await attachAvatars([conversation]);

    // Real-time: let the other participant's inbox show the new conversation
    // immediately (relevant when the first message hasn't been sent yet).
    const io = req.app.get("io");
    if (io) {
      io.to(participantId.toString()).emit("conversation_created", {
        conversation: enriched,
      });
    }

    res.json({ conversation: enriched });
  } catch (err) {
    console.error("Error creating conversation:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getConversations, createConversation };
