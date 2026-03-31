type ParseApiErrorOptions = {
  onAuthError?: () => void;
};

export function clearAdminAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function handleAdminSessionExpired() {
  if (typeof window === 'undefined') return;
  clearAdminAuth();
  if (window.location.pathname !== '/admin') {
    window.location.assign('/admin');
  }
}

export function adminAuthHeaders(includeJson = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (includeJson) headers['Content-Type'] = 'application/json';
  return headers;
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
