/**
 * Ensures a Supabase storage URL contains the `/public/` segment
 * required for unauthenticated (browser <img>) access.
 *
 * Converts:
 *   /storage/v1/object/bucket/path  →  /storage/v1/object/public/bucket/path
 *
 * Leaves already-correct URLs and external URLs untouched.
 */
export function ensurePublicStorageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Only fix Supabase storage URLs that are missing `/public/`
  const privatePath = '/storage/v1/object/';
  const publicPath = '/storage/v1/object/public/';

  if (url.includes(privatePath) && !url.includes(publicPath)) {
    return url.replace(privatePath, publicPath);
  }

  return url;
}
