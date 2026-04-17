type ParseApiErrorOptions = {
  onAuthError?: () => void;
};

const ADMIN_CSRF_COOKIE = 'admin_csrf';
const ADMIN_AUTH_FLASH_KEY = 'admin_auth_flash';

export function clearAdminAuth() {
  if (typeof window === 'undefined') return;
  // Backward compatibility cleanup for legacy token storage.
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function handleAdminSessionExpired() {
  if (typeof window === 'undefined') return;
  clearAdminAuth();
  try {
    window.sessionStorage.setItem(ADMIN_AUTH_FLASH_KEY, 'Your session expired. Please sign in again.');
    window.dispatchEvent(new CustomEvent('admin-session-expired'));
  } catch {
    // Ignore storage/event errors.
  }
  if (window.location.pathname !== '/admin') {
    window.location.assign('/admin');
  }
}

export function adminAuthHeaders(includeJson = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (includeJson) headers['Content-Type'] = 'application/json';
  return headers;
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!cookie) return null;
  return decodeURIComponent(cookie.slice(name.length + 1)) || null;
}

function isMutationMethod(method?: string): boolean {
  const normalized = (method || 'GET').toUpperCase();
  return normalized !== 'GET' && normalized !== 'HEAD' && normalized !== 'OPTIONS';
}

export function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  if (isMutationMethod(init.method) && !headers.has('x-csrf-token')) {
    const csrfToken = getCookieValue(ADMIN_CSRF_COOKIE);
    if (csrfToken) headers.set('x-csrf-token', csrfToken);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });
}

export async function adminLogout(): Promise<void> {
  try {
    await adminFetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // Ignore network errors; local auth state still gets cleared.
  }
}

export function consumeAdminAuthFlash(): string {
  if (typeof window === 'undefined') return '';
  try {
    const value = window.sessionStorage.getItem(ADMIN_AUTH_FLASH_KEY) || '';
    if (value) {
      window.sessionStorage.removeItem(ADMIN_AUTH_FLASH_KEY);
    }
    return value;
  } catch {
    return '';
  }
}

export async function parseApiError(
  res: Response,
  fallbackMessage: string,
  options: ParseApiErrorOptions = {}
): Promise<string> {
  if (res.status === 401 || res.status === 403) {
    options.onAuthError?.();
    return 'Session expired. Please sign in again.';
  }
  try {
    const data = await res.json();
    if (data && typeof data.error === 'string' && data.error.trim()) {
      return data.error.trim();
    }
  } catch {
    // Ignore non-JSON responses.
  }
  return fallbackMessage;
}
