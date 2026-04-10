import { Inter } from 'next/font/google';
import React from 'react';
import './fonts.css';
import './nh-page.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export default function NewHomeLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} nh-root`}>{children}</div>;
}
