// Time/date formatting helpers for the chat UI.

export function formatTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// Chat-list style timestamp: time today, "Yesterday", weekday this week,
// otherwise a short date.
export function formatListTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const today = startOfDay(new Date());
  const day = startOfDay(d);
  const diffDays = Math.round((today - day) / 86400000);

  if (diffDays === 0) return formatTime(d);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

// Label for day-separator rows inside a thread.
export function formatDayLabel(date) {
  const d = new Date(date);
  const today = startOfDay(new Date());
  const day = startOfDay(d);
  const diffDays = Math.round((today - day) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// True when two timestamps fall on different calendar days.
export function isDifferentDay(a, b) {
  return startOfDay(a) !== startOfDay(b);
}
