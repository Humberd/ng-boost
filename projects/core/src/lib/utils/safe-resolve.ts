export function safeResolve<T>(fn: () => T, fallback?: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}
