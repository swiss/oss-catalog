/**
 * Generates a stable hash from a URL string using a simple hash algorithm.
 * This ensures consistent IDs across builds for the same software URL.
 */
export function hashUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to positive hex string
  return Math.abs(hash).toString(36);
}
