// Pluggable Cloudinary wrapper for custom avatar uploads.
//
// Mirrors the mailer's fallback pattern: if the provider isn't configured, the
// app still works (preset avatars need no cloud config) — only the upload path
// fails loudly with a clear, catchable error and a one-time setup hint.

const cloudinary = require("cloudinary").v2;

// Prefer the canonical CLOUDINARY_* names; fall back to the shorter
// CLOUD_NAME/API_KEY/API_SECRET names if that's what the environment provides.
const CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
const API_SECRET =
  process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;

const isConfigured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (isConfigured) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
}

function ensureConfigured() {
  if (!isConfigured) {
    console.warn(
      "[cloudinary] ⚠ Avatar upload is not configured — set CLOUDINARY_CLOUD_NAME, " +
        "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to enable custom uploads. " +
        "Preset avatars still work without this."
    );
    throw new Error("avatar upload is not configured");
  }
}

// Upload a base64 data URI to the shared avatars folder. Returns the secure URL
// and the publicId (needed later to delete/replace the asset).
async function uploadAvatar(dataUri, userId) {
  ensureConfigured();
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: "chat-app/avatars",
    public_id: `user_${userId}_${Date.now()}`,
    resource_type: "image",
    overwrite: true,
  });
  return { url: res.secure_url, publicId: res.public_id };
}

// Best-effort delete — never throws, so callers can clean up without risking the
// main request. No-ops when unconfigured or when there's nothing to delete.
async function destroyAvatar(publicId) {
  if (!isConfigured || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("[cloudinary] Failed to destroy avatar", publicId, "-", err.message);
  }
}

module.exports = {
  uploadAvatar,
  destroyAvatar,
  isCloudinaryConfigured: () => isConfigured,
};
