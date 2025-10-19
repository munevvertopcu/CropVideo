export function formatSecondsFromMs(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '0';
  const seconds = ms / 1000;
  if (Math.abs(seconds - Math.round(seconds)) < 0.05) {
    return Math.round(seconds).toString();
  }
  return seconds.toFixed(1);
}

