import React from 'react';

const compactOutlineBtnStyle: React.CSSProperties = {
  border: 'none',
  fontSize: '0.74rem',
  padding: '0.3rem 0.48rem',
  borderRadius: 8,
  lineHeight: 1.2,
};

const compactPrimaryBtnStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  padding: '0.36rem 0.62rem',
  borderRadius: 9,
  lineHeight: 1.2,
};

export function AdminEditorCard({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  /** Optional anchor id for deep links (e.g. site-section-about.page). */
  id?: string;
}) {
  return (
    <div
      id={id}
      style={{
        background: '#fff',
        padding: '2.15rem',
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h3 style={{ marginBottom: '1.45rem', fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: 'var(--color-dark-blue)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export function AdminFormActions({
  onCancel,
  submitLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
      <button type="button" onClick={onCancel} className="btn btn-outline" style={compactOutlineBtnStyle}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" style={compactPrimaryBtnStyle}>
        {submitLabel}
      </button>
    </div>
  );
}
