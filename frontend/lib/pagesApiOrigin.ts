/**
 * Absolute base for server-side fetches to the Express API.
 * In the browser (including admin client components), prefer relative `/api/...` so Next rewrites always hit the backend.
 * RSC needs a real origin when `NEXT_PUBLIC_API_URL` is unset (e.g. Docker + `BACKEND_INTERNAL_URL` only).
 */
export function pagesApiOrigin(): string {
  const fromPublic = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (fromPublic) return fromPublic;
  const internal = process.env.BACKEND_INTERNAL_URL?.trim().replace(/\/$/, '');
  if (internal) return internal;
  return 'http://localhost:4005';
}
