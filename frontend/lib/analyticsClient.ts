const SESSION_STORAGE_KEY = 'ams_analytics_session';

export type AnalyticsEventType =
  | 'page_view'
  | 'newsletter_signup'
  | 'contact_submit'
  | 'cta_click'
  | 'outbound_link';

export function getAnalyticsSessionKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    let key = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!key) {
      key =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(SESSION_STORAGE_KEY, key);
    }
    return key;
  } catch {
    return '';
  }
}

export async function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  path: string,
  meta?: Record<string, unknown>
): Promise<void> {
  if (typeof window === 'undefined') return;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const body = {
    eventType,
    path: normalizedPath.slice(0, 1024),
    referrer: typeof document !== 'undefined' ? (document.referrer || '').slice(0, 1500) : '',
    sessionKey: getAnalyticsSessionKey(),
    meta: meta && typeof meta === 'object' ? meta : {},
  };
  try {
    await fetch('/api/public/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* non-blocking */
  }
}
