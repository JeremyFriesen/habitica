// Tracks socket IDs that recently made mutating API requests.
// The change stream uses this to exclude them from db:change notifications.

const writers = new Map(); // socketId -> timestamp
const TTL_MS = 5000;

export function addWriter (socketId) {
  if (!socketId) return;
  writers.set(socketId, Date.now());
}

export function getRecentWriterSocketIds () {
  const cutoff = Date.now() - TTL_MS;
  const active = new Set();
  writers.forEach((ts, socketId) => {
    if (ts >= cutoff) {
      active.add(socketId);
    } else {
      writers.delete(socketId);
    }
  });
  return active;
}
