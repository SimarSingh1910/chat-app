// Pluggable mailer.
//
// If a provider is configured via env vars it sends for real; otherwise it
// falls back to logging the message (including any reset link in the HTML) to
// the console, so flows that send email are fully testable in development with
// zero email setup. The fallback logs a clear warning so it's never mistaken
// for real delivery.
//
// Currently supports Resend over its HTTP API (no extra dependency — uses the
// global fetch available in Node 18+). To add SMTP, install nodemailer and
// branch on SMTP_* env vars here; callers don't change.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || "onboarding@resend.dev";

async function sendMail({ to, subject, html }) {
  if (RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: MAIL_FROM, to, subject, html }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Email send failed (${res.status}): ${body}`);
    }
    return;
  }

  // No provider configured — fall back to the console.
  console.warn(
    [
      "",
      "[mailer] ⚠ No email provider configured (set RESEND_API_KEY to send real mail).",
      "[mailer] Falling back to console output:",
      `[mailer]   To:      ${to}`,
      `[mailer]   Subject: ${subject}`,
      "[mailer]   HTML:",
      html,
      "",
    ].join("\n")
  );
}

module.exports = { sendMail };
