/* Local UI: use `npm run dev` (frontend/) or repo `./scripts/dev-hot.sh` — production Docker frontend
   needs `docker compose build frontend` after edits here. See README.md in this folder. */
import { Inter } from 'next/font/google';
import React from 'react';
import './fonts.css';
import './awsa.webflow.scoped.css';
import './nh-page.css';
import './nh-chrome-ref.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export default function NewHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} nh-root`}>
      <div className="public-shell public-shell--newhomepage">{children}</div>
    </div>
  );
}
