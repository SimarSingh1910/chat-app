const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

let io = null;

// Track which user IDs currently have at least one active socket.
// Map<userId, Set<socketId>> so multiple tabs/devices count correctly.
const onlineUsers = new Map();

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [name, ...rest] = part.trim().split("=");
    if (name) acc[name] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  });

  // Authenticate every socket using the JWT stored in the httpOnly `token` cookie.
  io.use((socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token = cookies.token;
      if (!token) return next(new Error("Unauthorized: no token"));

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.userId;
      next();
    } catch (err) {
      next(new Error("Unauthorized: invalid token"));
    }
  });

  // NOTE: keep this handler synchronous. If we `await` before registering the
  // socket.on(...) listeners below, events the client emits immediately after
  // connecting (e.g. join_conversation) arrive before the listeners exist and
  // are silently dropped.
  io.on("connection", (socket) => {
    const userId = socket.userId;

    // Personal room: lets us emit to a specific user across all their sockets.
    socket.join(userId);

    // Presence tracking (DB update is fire-and-forget; don't block the handler)
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
      User.findByIdAndUpdate(userId, { online: true }).catch(() => {});
      io.emit("user_online", { userId });
    }
    onlineUsers.get(userId).add(socket.id);

    // Join/leave a conversation room (used for typing indicators, etc.)
    socket.on("join_conversation", (conversationId) => {
      if (conversationId) socket.join(`conv:${conversationId}`);
    });
    socket.on("leave_conversation", (conversationId) => {
      if (conversationId) socket.leave(`conv:${conversationId}`);
    });

    // Typing indicator: relay to everyone else in the conversation room.
    socket.on("typing", ({ conversationId, isTyping }) => {
      if (!conversationId) return;
      socket.to(`conv:${conversationId}`).emit("typing", {
        conversationId,
        userId,
        isTyping,
      });
    });

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (!sockets) return;
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        User.findByIdAndUpdate(userId, { online: false }).catch(() => {});
        io.emit("user_offline", { userId });
      }
    });
  });

  return io;
}

function getIo() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

function isUserOnline(userId) {
  return onlineUsers.has(String(userId));
}

module.exports = { initSocket, getIo, isUserOnline };
