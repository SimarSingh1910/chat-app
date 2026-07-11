const Message = require("../models/message");
const Conversation = require("../models/conversation");

async function sendMessage(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { conversationId, text } = req.body;
    if (!conversationId || !text) {
      return res
        .status(400)
        .json({ error: "Conversation ID and text required" });
    }

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Create message
    const message = new Message({
      conversationId,
      sender: req.user.userId,
      text,
    });
    await message.save();

    // Update conversation lastMessage and unreadCounts
    const otherParticipants = conversation.participants.filter(
      (p) => p.toString() !== req.user.userId
    );
    const update = {
      lastMessage: {
        _id: message._id,
        text: message.text,
        sender: message.sender,
        createdAt: message.createdAt,
        expiresAt: message.expiresAt,
      },
    };
    for (const p of otherParticipants) {
      update[`unreadCounts.${p}`] = (conversation.unreadCounts.get(p) || 0) + 1;
    }
    await Conversation.findByIdAndUpdate(conversationId, { $set: update });

    // Populate and return
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "username"
    );

    // Real-time: notify the other participant(s) of the new message and
    // push an updated conversation preview for their inbox list.
    const io = req.app.get("io");
    if (io) {
      const payload = {
        message: populatedMessage,
        conversationId: conversationId.toString(),
      };
      for (const p of otherParticipants) {
        io.to(p.toString()).emit("new_message", payload);
        io.to(p.toString()).emit("conversation_updated", {
          conversationId: conversationId.toString(),
          lastMessage: update.lastMessage,
        });
      }
    }

    res.json({ message: populatedMessage });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function getMessages(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { conversationId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "username")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json({ messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function markAsRead(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { conversationId } = req.params;

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: req.user.userId },
        readAt: null,
      },
      { $set: { readAt: new Date() } }
    );

    // Reset unread count
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCounts.${req.user.userId}`]: 0 },
    });

    // Real-time: send read receipts to the other participant(s) so their
    // sent messages can show as "read".
    const io = req.app.get("io");
    if (io) {
      const others = conversation.participants.filter(
        (p) => p.toString() !== req.user.userId
      );
      for (const p of others) {
        io.to(p.toString()).emit("messages_read", {
          conversationId: conversationId.toString(),
          readerId: req.user.userId,
          readAt: new Date(),
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error marking as read:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { sendMessage, getMessages, markAsRead };
