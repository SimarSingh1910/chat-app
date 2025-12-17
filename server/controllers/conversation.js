const Conversation = require("../models/conversation");
const User = require("../models/user");

async function getConversations(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const conversations = await Conversation.find({
      participants: req.user.userId,
    })
      .populate("participants", "username first_name last_name")
      .populate("lastMessage.sender", "username")
      .sort({ updatedAt: -1 });

    res.json({ conversations });
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

    // Sort participants for uniqueness
    const participants = [req.user.userId, participantId].sort();

    // Find existing or create new
    let conversation = await Conversation.findOne({ participants });
    if (!conversation) {
      conversation = new Conversation({ participants });
      await conversation.save();
    }

    // Populate and return
    conversation = await Conversation.findById(conversation._id)
      .populate("participants", "username first_name last_name")
      .populate("lastMessage.sender", "username");

    res.json({ conversation });
  } catch (err) {
    console.error("Error creating conversation:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getConversations, createConversation };
