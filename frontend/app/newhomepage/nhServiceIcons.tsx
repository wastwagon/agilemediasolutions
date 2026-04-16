import React from 'react';

/** Line-art icons matching the Webflow template embeds (stroke #fff). */
const iconProps = {
  width: 48,
  height: 48,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: '#FFFFFF',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  style: { display: 'block' },
};

export const nhServiceIconSvgs: React.ReactNode[] = [
  <svg key="svc-0" {...iconProps}>
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 8h18" />
    <path d="M8 20h8" />
  </svg>,
  <svg key="svc-1" {...iconProps}>
    <path d="M12 3l7 4v6c0 4.5-3.1 7.5-7 8-3.9-.5-7-3.5-7-8V7l7-4z" />
    <path d="M9 12h6" />
  </svg>,
  <svg key="svc-2" {...iconProps}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="18" height="7" rx="1.5" />
  </svg>,
  <svg key="svc-3" {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="8" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="16" cy="12" r="1.5" />
  </svg>,
  <svg key="svc-4" {...iconProps} stroke="white">
    <circle cx="11" cy="11" r="6" />
    <path d="M21 21l-4.3-4.3" />
    <path d="M8 11l2 2 4-4" />
  </svg>,
  <svg key="svc-5" {...iconProps}>
    <path d="M3 11v2" />
    <path d="M7 9v6" />
    <path d="M11 6v12" />
    <path d="M15 9v6" />
    <path d="M19 11v2" />
  </svg>,
];
