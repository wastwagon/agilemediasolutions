import './styles.css';
import './brands.css';
import './careers.css';
import './partnerships.css';
import './services.css';
import React from 'react';
import type { Metadata } from 'next';
import AppShell from '../components/AppShell';
import OrganizationJsonLd from '../components/OrganizationJsonLd';
import { publicSiteUrl } from '@/lib/publicSite';

const siteUrl = publicSiteUrl();

const defaultDescription =
  'International media, PR, and communications firm helping governments, institutions, brands, and movements shape the messages that move nations, markets, and minds.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Agile Media Solutions',
    default: 'Agile Media Solutions | Strategic communications & media',
  },
  description: defaultDescription,
  applicationName: 'Agile Media Solutions',
  keywords: [
    'strategic communications',
    'public relations',
    'media relations',
    'Africa communications',
    'brand narrative',
    'crisis communications',
    'digital engagement',
    'Agile Media Solutions',
    'government communications',
    'institutional PR',
  ],
  authors: [{ name: 'Agile Media Solutions', url: siteUrl }],
  creator: 'Agile Media Solutions',
  publisher: 'Agile Media Solutions',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Agile Media Solutions | Strategic communications & media',
    description: defaultDescription,
    siteName: 'Agile Media Solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agile Media Solutions | Strategic communications & media',
    description: defaultDescription,
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
        <OrganizationJsonLd />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
