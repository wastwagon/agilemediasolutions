import type React from 'react';

export const adminThStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  padding: '1.2rem',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  background: 'var(--color-bg-alt)',
};

export const adminActionBtnStyle: React.CSSProperties = {
  background: 'var(--color-bg-alt)',
  border: '1px solid var(--color-border)',
  borderRadius: 7,
  cursor: 'pointer',
  fontSize: '0.76rem',
  fontWeight: 700,
  lineHeight: 1.2,
  padding: '0.3rem 0.5rem',
  marginLeft: '0.45rem',
};
