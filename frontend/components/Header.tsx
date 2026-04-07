'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteSectionContent } from '@/lib/siteSectionCms';
import { DEFAULT_PHONE_WHATSAPP_HREF, DEFAULT_PHONE_WHATSAPP_LABEL } from '@/lib/defaultPhoneChannel';
import {
  DEFAULT_AGILE_INSTAGRAM_URL,
  DEFAULT_AGILE_LINKEDIN_URL,
  DEFAULT_AGILE_X_URL,
  DEFAULT_AGILE_YOUTUBE_URL,
  DEFAULT_FACEBOOK_URL,
} from '@/lib/defaultSocialUrls';
import './Header.css';

const navItems = [
  { label: 'Home', href: '/' },
  { 
    label: 'About', 
    href: '/about',
    subItems: [
      { label: 'About us', href: '/about' },
      { label: 'Sectors', href: '/sectors' },
      { label: 'Partnerships', href: '/partnerships' }
    ]
  },
  { 
    label: 'Services', 
    href: '/services',
    subItems: [
      { label: 'All services', href: '/services' },
      { label: 'Digital engagement', href: '/digital-engagement' },
      { label: 'Studio', href: '/studio' }
    ]
  },
  { label: 'Media & brands', href: '/brands' },
  { 
    label: 'Insights', 
    href: '/insights',
    subItems: [
      { label: 'Press room', href: '/insights' },
      { label: 'Agile Press Group', href: '/agile-press-group' },
      { label: 'Case studies', href: '/case-studies' }
    ]
  },
  { label: 'Events', href: '/signature-events' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const bar = useSiteSectionContent('layout.topBar', {
    email: 'info@agilemediasolutions.com',
    contactLabel: DEFAULT_PHONE_WHATSAPP_LABEL,
    contactHref: DEFAULT_PHONE_WHATSAPP_HREF,
    facebookUrl: DEFAULT_FACEBOOK_URL,
    twitterUrl: DEFAULT_AGILE_X_URL,
    instagramUrl: DEFAULT_AGILE_INSTAGRAM_URL,
    linkedinUrl: DEFAULT_AGILE_LINKEDIN_URL,
    youtubeUrl: DEFAULT_AGILE_YOUTUBE_URL,
  });
  const fb = bar.facebookUrl?.trim() || DEFAULT_FACEBOOK_URL;
  const tw = bar.twitterUrl?.trim() || DEFAULT_AGILE_X_URL;
  const ig = bar.instagramUrl?.trim() || DEFAULT_AGILE_INSTAGRAM_URL;
  const li = bar.linkedinUrl?.trim() || DEFAULT_AGILE_LINKEDIN_URL;
  const yt = bar.youtubeUrl?.trim() || DEFAULT_AGILE_YOUTUBE_URL;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className={`modern-header ${scrolled ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}>
      <div className="header-container">
        <Link href="/" className="modern-logo">
          <img src="/images/agilemediasolutionslogo.png" alt="Agile Media Solutions" />
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.label} className={item.subItems ? 'has-dropdown' : ''}>
                <Link href={item.href} className={pathname === item.href ? 'active' : ''}>
                  {item.label} {item.subItems && <span className="dropdown-arrow"></span>}
                </Link>
                {item.subItems && (
                  <div className="mega-menu">
                    <ul className="mega-links">
                      {item.subItems.map((sub) => (
                        <li key={sub.label}>
                          <Link href={sub.href}>{sub.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Right */}
        <div className="header-actions">
          <Link href="/contact#contact" className="action-btn">Work With Us</Link>
          <button 
            className="hamburger-btn" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`burger ${isOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-inner">
          <div className="drawer-header">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <img src="/images/agilemediasolutionslogo.png" alt="Agile Media Solutions" className="drawer-logo" />
            </Link>
            <button className="drawer-close" onClick={() => setIsOpen(false)} aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <nav className="mobile-nav">
            <ul className="mobile-links">
              {navItems.map((item) => (
                <li key={item.label} className="mobile-item">
                  <Link href={item.href} className="mobile-main-link">{item.label}</Link>
                  {item.subItems && (
                    <ul className="mobile-sublinks">
                      {item.subItems.map((sub) => (
                        <li key={sub.label}>
                          <Link href={sub.href}>{sub.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="drawer-footer">
             <div className="drawer-socials">
                <a href={fb} target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href={tw} target="_blank" rel="noopener noreferrer">X</a>
                <a href={ig} target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href={li} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={yt} target="_blank" rel="noopener noreferrer">YouTube</a>
             </div>
          </div>
        </div>
      </div>
      <div className={`drawer-overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)}></div>
    </header>
  );
}
