import React from 'react';

export type AdminNoticeTone = 'success' | 'error' | 'info';

const toneStyles: Record<AdminNoticeTone, { background: string; border: string; color: string }> = {
  success: {
    background: 'rgba(22, 163, 74, 0.08)',
    border: '1px solid rgba(22, 163, 74, 0.2)',
    color: '#166534',
  },
  error: {
    background: 'rgba(211, 47, 47, 0.08)',
    border: '1px solid rgba(211, 47, 47, 0.18)',
    color: '#9A3412',
  },
  info: {
    background: 'rgba(37, 99, 235, 0.08)',
    border: '1px solid rgba(37, 99, 235, 0.18)',
    color: '#1D4ED8',
  },
};

function NoticeIcon({ tone }: { tone: AdminNoticeTone }) {
  if (tone === 'success') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.45" />
        <path d="M7 12.5l3 3 7-7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (tone === 'error') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.45" />
        <path d="M12 7.5v6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="17.2" r="1.15" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.45" />
      <path d="M12 11.2v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="7.7" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function AdminNotice({
  tone,
  message,
  onDismiss,
}: {
  tone: AdminNoticeTone;
  message: string;
  onDismiss?: () => void;
}) {
  const [visible, setVisible] = React.useState(false);
  const dismissTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  React.useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        window.clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  if (!message) return null;

  const handleDismiss = () => {
    if (!onDismiss) return;
    setVisible(false);
    dismissTimerRef.current = window.setTimeout(() => {
      onDismiss();
    }, 170);
  };

  const s = toneStyles[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      style={{
        marginTop: '1rem',
        background: s.background,
        border: s.border,
        padding: '0.78rem 0.95rem',
        borderRadius: 12,
        color: s.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        boxShadow: '0 8px 20px -16px rgba(13, 33, 59, 0.5)',
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 160ms ease, transform 170ms ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.58rem', minWidth: 0 }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.52)',
            flexShrink: 0,
          }}
        >
          <NoticeIcon tone={tone} />
        </span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{message}</span>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss notice"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'currentColor',
            cursor: 'pointer',
            fontSize: '1rem',
            lineHeight: 1,
            padding: '0.1rem',
            opacity: 0.75,
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
