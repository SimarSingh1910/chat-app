const User = require("../models/user");
const Profile = require("../models/profile");

// Load the requester's relationship id sets (as strings) once, so results can
// be annotated without a query per user.
async function relationshipSets(userId) {
  const self = await User.findById(userId).select(
    "friends sentRequests receivedRequests"
  );
  return {
    friends: new Set((self?.friends || []).map(String)),
    sent: new Set((self?.sentRequests || []).map(String)),
    recv: new Set((self?.receivedRequests || []).map(String)),
  };
}

// Requester's relationship to `id`: friend | outgoing | incoming | none.
function relationshipFor(id, sets) {
  const s = id.toString();
  if (sets.friends.has(s)) return "friend";
  if (sets.sent.has(s)) return "outgoing"; // requester sent them a pending req
  if (sets.recv.has(s)) return "incoming"; // they sent the requester a pending req
  return "none";
}

// Attach each user's profile avatar so the client never has to join manually.
async function withAvatars(users) {
  const ids = users.map((u) => u._id);
  const profiles = await Profile.find({ user: { $in: ids } }).select(
    "user selectedImage statusMood pronoun"
  );
  const byUser = new Map(profiles.map((p) => [p.user.toString(), p]));
  return users.map((u) => {
    const profile = byUser.get(u._id.toString());
    return {
      _id: u._id,
      first_name: u.first_name,
      last_name: u.last_name,
      username: u.username,
      email: u.email,
      online: u.online,
      avatar: profile?.selectedImage || null,
      statusMood: profile?.statusMood || "",
      pronoun: profile?.pronoun || "",
    };
  });
}

// GET /users/search?q=term — find people to chat with (excludes self).
async function searchUsers(req, res) {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ users: [] });

    // Escape regex metacharacters so "a+b" doesn't blow up the query.
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safe, "i");

    const users = await User.find({
      _id: { $ne: req.user.userId },
      $or: [
        { username: regex },
        { first_name: regex },
        { last_name: regex },
        { email: regex },
      ],
    })
      .select("first_name last_name username email online")
      .limit(10);

    const sets = await relationshipSets(req.user.userId);
    const withRel = (await withAvatars(users)).map((u) => ({
      ...u,
      relationship: relationshipFor(u._id, sets),
    }));

    res.json({ users: withRel });
  } catch (err) {
    console.error("Error searching users:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /users/:id — public profile details for the right-hand panel.
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select(
      "first_name last_name username email online"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    const profile = await Profile.findOne({ user: user._id }).select(
      "selectedImage statusMood pronoun hobbies onlineStatus"
    );

    const sets = await relationshipSets(req.user.userId);

    res.json({
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        online: user.online,
        avatar: profile?.selectedImage || null,
        statusMood: profile?.statusMood || "",
        pronoun: profile?.pronoun || "",
        hobbies: profile?.hobbies || {},
        relationship: relationshipFor(user._id, sets),
      },
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { searchUsers, getUserById, withAvatars };
