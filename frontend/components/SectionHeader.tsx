import Link from 'next/link';
import React from 'react';

export type SectionHeaderProps = {
  label: string;
  title: React.ReactNode;
  linkHref?: string;
  linkLabel?: string;
  /** `home` = dark home bands; `inner` = creative public pages */
  variant: 'home' | 'inner';
  className?: string;
  /** Extra classes on the `h2` (e.g. `digital-title`) */
  titleClassName?: string;
  /** `stack` = centered column (e.g. form intros); default is label/title | link row */
  layout?: 'row' | 'stack';
};

export default function SectionHeader({
  label,
  title,
  linkHref,
  linkLabel,
  variant,
  className,
  titleClassName,
  layout = 'row',
}: SectionHeaderProps) {
  const wrap = variant === 'home' ? 'home-section-head' : 'inner-section-head';
  const linkClass = variant === 'home' ? 'section-head-link' : 'inner-section-link';
  const h2Class = ['section-title', titleClassName].filter(Boolean).join(' ');
  const stackMod = layout === 'stack' ? `${wrap}--stack` : '';

  return (
    <div className={[wrap, stackMod, className].filter(Boolean).join(' ')}>
      <div>
        <span className="section-label">{label}</span>
        <h2 className={h2Class}>{title}</h2>
      </div>
      {linkHref && linkLabel ? (
        <Link href={linkHref} className={linkClass}>
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
