'use client';

import Link from 'next/link';
import React from 'react';

const linkStyle: React.CSSProperties = {
  color: 'var(--color-primary)',
  fontSize: '0.85rem',
  textDecoration: 'none',
  fontWeight: 600,
};

export function adminUrlIsInternal(href: string) {
  const t = (href || '').trim();
  return t.startsWith('/') && !t.startsWith('//');
}

function isMailtoOrTel(href: string) {
  return /^(mailto:|tel:|sms:)/i.test((href || '').trim());
}

export default function AdminUrlLink({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const inlineStyle = style ?? (className ? undefined : linkStyle);

  if (isMailtoOrTel(href)) {
    return (
      <a href={href} className={className} style={inlineStyle}>
        {children}
      </a>
    );
  }

  if (adminUrlIsInternal(href)) {
    return (
      <Link href={href} className={className} style={inlineStyle}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      style={inlineStyle}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
