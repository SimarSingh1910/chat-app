const mongoose = require("mongoose");
const User = require("../models/user");
const Profile = require("../models/profile");

// ---- helpers -------------------------------------------------------------

// Membership check via string comparison — never rely on ObjectId ===.
const idIn = (arr, id) => arr.some((x) => x.toString() === id.toString());

// Lean public shape (+avatar) for a set of user ids, attached the same way the
// conversations list does it (Profile.selectedImage). Order is not guaranteed.
async function publicUsers(ids) {
  if (!ids || ids.length === 0) return [];
  const users = await User.find({ _id: { $in: ids } }).select(
    "username first_name last_name"
  );
  const profiles = await Profile.find({ user: { $in: ids } }).select(
    "user selectedImage"
  );
  const avatarBy = new Map(
    profiles.map((p) => [p.user.toString(), p.selectedImage || null])
  );
  return users.map((u) => ({
    _id: u._id,
    username: u.username,
    first_name: u.first_name,
    last_name: u.last_name,
    avatar: avatarBy.get(u._id.toString()) || null,
  }));
}

async function publicUser(id) {
  const [u] = await publicUsers([id]);
  return u || null;
}

// A pair of writes that fully establishes friendship between a and b and clears
// any pending request in EITHER direction. Idempotent ($addToSet / $pull).
function friendshipOps(a, b) {
  return [
    {
      filter: { _id: a },
      update: { $addToSet: { friends: b }, $pull: { sentRequests: b, receivedRequests: b } },
    },
    {
      filter: { _id: b },
      update: { $addToSet: { friends: a }, $pull: { sentRequests: a, receivedRequests: a } },
    },
  ];
}

// Clear a single pending request (requester -> target) from both sides.
function clearPendingOps(requester, target) {
  return [
    { filter: { _id: requester }, update: { $pull: { sentRequests: target } } },
    { filter: { _id: target }, update: { $pull: { receivedRequests: requester } } },
  ];
}

function isTxnUnsupported(err) {
  const msg = (err && err.message) || "";
  return (
    err?.code === 20 ||
    err?.code === 263 ||
    err?.codeName === "IllegalOperation" ||
    /Transaction numbers are only allowed|Transactions are not supported|not supported|replica set|mongos/i.test(
      msg
    )
  );
}

// Apply an ordered list of {filter, update} writes. Wraps them in a multi-doc
// transaction when the deployment supports it (replica set / Atlas); on a
// standalone mongod it transparently falls back to sequential writes. Because
// every op is idempotent, the non-transactional path is self-healing on retry.
async function applyWrites(ops) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const op of ops) {
        await User.updateOne(op.filter, op.update, { session });
      }
    });
  } catch (err) {
    if (!isTxnUnsupported(err)) throw err;
    // Standalone mongod — no transactions. Ordered idempotent writes.
    for (const op of ops) {
      await User.updateOne(op.filter, op.update);
    }
  } finally {
    session.endSession();
  }
}

function emitTo(req, userId, event, payload) {
  const io = req.app.get("io");
  if (io) io.to(userId.toString()).emit(event, payload);
}

function validTarget(req, res) {
  const userId = req.body?.userId || req.params?.userId;
  if (!userId || !mongoose.isValidObjectId(userId)) {
    res.status(400).json({ error: "Valid userId is required" });
    return null;
  }
  if (userId.toString() === req.user.userId.toString()) {
    res.status(400).json({ error: "You cannot do this to yourself" });
    return null;
  }
  return userId.toString();
}

// ---- actions -------------------------------------------------------------

// POST /friends/request { userId }
async function sendRequest(req, res) {
  try {
    const targetId = validTarget(req, res);
    if (!targetId) return;
    const selfId = req.user.userId;

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ error: "User not found" });

    const self = await User.findById(selfId);
    if (!self) return res.status(404).json({ error: "User not found" });

    if (idIn(self.friends, targetId)) {
      return res.status(409).json({ error: "You are already friends" });
    }

    // Mutual auto-accept: the target already has a pending request to us
    // (they're in our receivedRequests). Complete the friendship instead of
    // creating a second, opposite pending request.
    if (idIn(self.receivedRequests, targetId)) {
      await applyWrites(friendshipOps(selfId, targetId));
      const [selfShape, targetShape] = await Promise.all([
        publicUser(selfId),
        publicUser(targetId),
      ]);
      // Both sides transition to "friends" live.
      emitTo(req, targetId, "friend_request_accepted", { user: selfShape });
      emitTo(req, selfId, "friend_request_accepted", { user: targetShape });
      return res.json({ status: "friends", autoAccepted: true, user: targetShape });
    }

    if (idIn(self.sentRequests, targetId)) {
      return res.status(409).json({ error: "Friend request already sent" });
    }

    await applyWrites([
      { filter: { _id: selfId }, update: { $addToSet: { sentRequests: targetId } } },
      { filter: { _id: targetId }, update: { $addToSet: { receivedRequests: selfId } } },
    ]);

    const selfShape = await publicUser(selfId);
    emitTo(req, targetId, "friend_request_received", { user: selfShape });
    return res.json({ status: "pending", autoAccepted: false, user: await publicUser(targetId) });
  } catch (err) {
    console.error("Error sending friend request:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /friends/accept { userId }  — self (Y) accepts requester (X)
async function acceptRequest(req, res) {
  try {
    const requesterId = validTarget(req, res);
    if (!requesterId) return;
    const selfId = req.user.userId;

    const requester = await User.findById(requesterId);
    if (!requester) return res.status(404).json({ error: "User not found" });

    const self = await User.findById(selfId);
    if (!self) return res.status(404).json({ error: "User not found" });

    if (!idIn(self.receivedRequests, requesterId)) {
      return res.status(409).json({ error: "No pending request from this user" });
    }

    await applyWrites(friendshipOps(selfId, requesterId));

    // Tell the original requester their request was accepted (with our shape).
    const selfShape = await publicUser(selfId);
    emitTo(req, requesterId, "friend_request_accepted", { user: selfShape });

    return res.json({ status: "friends", user: await publicUser(requesterId) });
  } catch (err) {
    console.error("Error accepting friend request:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /friends/reject { userId }  — self (Y) rejects requester (X)
async function rejectRequest(req, res) {
  try {
    const requesterId = validTarget(req, res);
    if (!requesterId) return;
    const selfId = req.user.userId;

    const self = await User.findById(selfId);
    if (!self) return res.status(404).json({ error: "User not found" });

    if (!idIn(self.receivedRequests, requesterId)) {
      return res.status(409).json({ error: "No pending request from this user" });
    }

    await applyWrites(clearPendingOps(requesterId, selfId));

    // Notify the requester (X) so their outgoing request clears live.
    emitTo(req, requesterId, "friend_request_rejected", { userId: selfId });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error rejecting friend request:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /friends/cancel { userId }  — self (X) withdraws own request to Y
async function cancelRequest(req, res) {
  try {
    const targetId = validTarget(req, res);
    if (!targetId) return;
    const selfId = req.user.userId;

    const self = await User.findById(selfId);
    if (!self) return res.status(404).json({ error: "User not found" });

    if (!idIn(self.sentRequests, targetId)) {
      return res.status(409).json({ error: "No pending request to cancel" });
    }

    await applyWrites(clearPendingOps(selfId, targetId));

    // Notify the target (Y) so their incoming request clears live.
    emitTo(req, targetId, "friend_request_cancelled", { userId: selfId });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error cancelling friend request:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /friends/:userId  — self (X) unfriends Y
async function unfriend(req, res) {
  try {
    const targetId = validTarget(req, res);
    if (!targetId) return;
    const selfId = req.user.userId;

    const self = await User.findById(selfId);
    if (!self) return res.status(404).json({ error: "User not found" });

    if (!idIn(self.friends, targetId)) {
      return res.status(409).json({ error: "You are not friends with this user" });
    }

    await applyWrites([
      { filter: { _id: selfId }, update: { $pull: { friends: targetId } } },
      { filter: { _id: targetId }, update: { $pull: { friends: selfId } } },
    ]);

    emitTo(req, targetId, "friend_removed", { userId: selfId });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error removing friend:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ---- reads ---------------------------------------------------------------

// GET /friends
async function getFriends(req, res) {
  try {
    const self = await User.findById(req.user.userId).select("friends");
    if (!self) return res.status(404).json({ error: "User not found" });
    return res.json({ friends: await publicUsers(self.friends) });
  } catch (err) {
    console.error("Error fetching friends:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /friends/requests → { incoming, outgoing }
async function getRequests(req, res) {
  try {
    const self = await User.findById(req.user.userId).select(
      "receivedRequests sentRequests"
    );
    if (!self) return res.status(404).json({ error: "User not found" });
    const [incoming, outgoing] = await Promise.all([
      publicUsers(self.receivedRequests),
      publicUsers(self.sentRequests),
    ]);
    return res.json({ incoming, outgoing });
  } catch (err) {
    console.error("Error fetching friend requests:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  unfriend,
  getFriends,
  getRequests,
};
