'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import NewsletterForm from './NewsletterForm';
import TopBar from './TopBar';
import Header from './Header';
import Preloader from './Preloader';
import MobileTabBar from './MobileTabBar';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  useScrollAnimations(isAdminRoute ? [] : [pathname]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Preloader />
      <TopBar />
      <Header />
      <div className="public-shell">{children}</div>
      <footer className="footer" id="footer">
        <div className="footer-impact-text">Agile Media</div>
        <div className="footer-top">
          <div className="footer-inner">
            <div className="footer-branding">
              <Link href="/" className="footer-logo" aria-label="Agile Media Solutions home">
                <img src="/images/agilemediasolutionslogo.png" alt="Agile Media Solutions" />
              </Link>
              <p className="footer-branding-copy">
                We shape narratives that move institutions, markets, and culture across Africa and beyond.
              </p>
            </div>
            <div className="footer-columns">
              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><Link href="/about">Who we are</Link></li>
                  <li><Link href="/services">Services</Link></li>
                  <li><Link href="/sectors">Sectors</Link></li>
                  <li><Link href="/studio">Studio</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Agile Press Group</h4>
                <ul>
                  <li><Link href="/agile-press-group">Agile Press Group</Link></li>
                  <li><Link href="/brands">Our brands</Link></li>
                  <li><Link href="/case-studies">Case studies</Link></li>
                  <li><Link href="/insights">Resources</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Press room</h4>
                <ul>
                  <li><Link href="/insights">Insights</Link></li>
                  <li><Link href="/digital-engagement">Digital engagement</Link></li>
                  <li><Link href="/signature-events">Events</Link></li>
                  <li><Link href="/careers">Careers</Link></li>
                  <li><Link href="/partnerships">Partnerships</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Contact &amp; legal</h4>
                <ul>
                  <li><Link href="/contact">Contact us</Link></li>
                  <li><Link href="/privacy">Privacy policy</Link></li>
                  <li><Link href="/terms">Terms of service</Link></li>
                  <li><Link href="/cookies">Cookie notice</Link></li>
                </ul>
              </div>
              <div className="footer-col footer-newsletter" id="newsletter">
                <h4>Newsletter</h4>
                <p>
                  Subscribe to <strong>the Agile Brief</strong>-our monthly roundup of ideas, strategy, and news. No spam.
                </p>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-inner footer-bottom-inner">
            <p className="copyright">© {new Date().getFullYear()} Agile Media Solutions. All rights reserved.</p>
            <div className="footer-legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/cookies">Cookies</Link>
            </div>
            <div className="footer-social" id="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <MobileTabBar />
    </>
  );
}
