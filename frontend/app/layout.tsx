import './styles.css';
import './brands.css';
import './careers.css';
import './partnerships.css';
import './services.css';
import React from 'react';
import type { Metadata } from 'next';
import AppShell from '../components/AppShell';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agilemediasolutions.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Agile Media Solutions',
    default: 'Agile Media Solutions | Communications & media',
  },
  description:
    'International media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.',
  keywords: ['Media', 'Marketing', 'Communications', 'Agile', 'Storytelling', 'PR', 'Digital Marketing'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Agile Media Solutions | Communications & media',
    description:
      'International media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.',
    siteName: 'Agile Media Solutions',
    images: [
      {
        url: '/images/agilemediasolutionslogo.png',
        width: 1200,
        height: 630,
        alt: 'Agile Media Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agile Media Solutions | Communications & media',
    description:
      'International media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.',
    images: ['/images/agilemediasolutionslogo.png'],
  },
  icons: {
    icon: '/images/favicon.ico',
    apple: '/images/agilemediasolutionslogo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
