import type { Metadata } from 'next';
import NewHomePageClient from './NewHomePageClient';

export const metadata: Metadata = {
  title: 'Concept home | Agile Media Solutions',
  description:
    'Experimental single-page layout inspired by the Awsa Webflow template — static English preview, separate from the main CMS-driven homepage.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Concept home | Agile Media Solutions',
    description:
      'Experimental static preview at /newhomepage — not indexed; main site homepage and CMS are unchanged.',
  },
};

export default function NewHomePage() {
  return <NewHomePageClient />;
}
