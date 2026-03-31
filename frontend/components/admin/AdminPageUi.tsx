import React from 'react';

const compactPrimaryBtnStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  padding: '0.36rem 0.62rem',
  borderRadius: 9,
  lineHeight: 1.2,
};

type AdminPageHeaderProps = {
  title: string;
  subtitle: string;
  addLabel: string;
  isAdding: boolean;
  onAdd: () => void;
};

export function AdminPageHeader({ title, subtitle, addLabel, isAdding, onAdd }: AdminPageHeaderProps) {
  return (
    <div
      className="admin-header"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.9rem', marginBottom: '1.65rem' }}
    >
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', lineHeight: 1.1, marginBottom: '0.42rem', color: 'var(--color-dark-blue)' }}>
          {title}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.02rem', maxWidth: '54ch' }}>{subtitle}</p>
      </div>
      {!isAdding && (
        <button onClick={onAdd} className="btn btn-primary" style={compactPrimaryBtnStyle}>
          {addLabel}
        </button>
      )}
    </div>
  );
}

export function AdminLoadingState() {
  return (
    <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
      Loading…
    </div>
  );
}

export function AdminErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div style={{ padding: '1rem', background: '#FEF2F2', color: '#B91C1C', borderRadius: '8px', marginBottom: '2rem' }}>
      {message}
    </div>
  );
}
