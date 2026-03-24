'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Header.css';

const navItems = [
  { label: 'Home', href: '/' },
  { 
    label: 'About', 
    href: '/about',
    subItems: [
      { label: 'Who We Are', href: '/about' },
      { label: 'Sectors We Serve', href: '/sectors' },
      { label: 'Partnerships', href: '/partnerships' }
    ]
  },
  { 
    label: 'Services', 
    href: '/services',
    subItems: [
      { label: 'All Services', href: '/services' },
      { label: 'Digital Engagement', href: '/digital-engagement' },
      { label: 'Campaigns & Advocacy', href: '/services' }
    ]
  },
  { label: 'Media & Brands', href: '/brands' },
  { 
    label: 'Insights', 
    href: '/insights',
    subItems: [
      { label: 'Press Room', href: '/insights' },
      { label: 'Case Studies', href: '/case-studies' }
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
          <img src="/images/ams-logo.png" alt="Agile Media Solutions" />
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
          <Link href="/contact" className="action-btn">Work With Us</Link>
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
              <img src="/images/ams-logo.png" alt="Logo" className="drawer-logo" />
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
                <a href="#">FB</a>
                <a href="#">TW</a>
                <a href="#">IG</a>
                <a href="#">LI</a>
             </div>
          </div>
        </div>
      </div>
      <div className={`drawer-overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)}></div>
    </header>
  );
}
