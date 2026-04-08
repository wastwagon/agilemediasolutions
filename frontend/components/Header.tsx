'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, stripLocalePrefix, withLocalePrefix } from '@/lib/locale';
import { t } from '@/lib/i18n';
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
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const plainPathname = stripLocalePrefix(pathname || '/');
  const contactCtaHref = `${withLocalePrefix('/contact', locale)}#contact`;
  const navItems = [
    { label: t(locale, 'navHome'), href: '/' },
    {
      label: t(locale, 'navAbout'),
      href: '/about',
      subItems: [
        { label: t(locale, 'navAboutUs'), href: '/about' },
        { label: t(locale, 'navSectors'), href: '/sectors' },
        { label: t(locale, 'navPartnerships'), href: '/partnerships' },
      ],
    },
    {
      label: t(locale, 'navServices'),
      href: '/services',
      subItems: [
        { label: t(locale, 'navAllServices'), href: '/services' },
        { label: t(locale, 'navDigitalEngagement'), href: '/digital-engagement' },
        { label: t(locale, 'navStudio'), href: '/studio' },
      ],
    },
    { label: t(locale, 'navMediaBrands'), href: '/brands' },
    {
      label: t(locale, 'navInsights'),
      href: '/insights',
      subItems: [
        { label: t(locale, 'navPressRoom'), href: '/insights' },
        { label: t(locale, 'navAgilePressGroup'), href: '/agile-press-group' },
        { label: t(locale, 'navCaseStudies'), href: '/case-studies' },
      ],
    },
    { label: t(locale, 'navEvents'), href: '/signature-events' },
    { label: t(locale, 'navCareers'), href: '/careers' },
    { label: t(locale, 'navContact'), href: '/contact' },
  ];
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
        <Link href={withLocalePrefix('/', locale)} className="modern-logo">
          <img src="/images/agilemediasolutionslogo.png" alt="Agile Media Solutions" />
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.label} className={item.subItems ? 'has-dropdown' : ''}>
                <Link href={withLocalePrefix(item.href, locale)} className={plainPathname === item.href ? 'active' : ''}>
                  {item.label} {item.subItems && <span className="dropdown-arrow"></span>}
                </Link>
                {item.subItems && (
                  <div className="mega-menu">
                    <ul className="mega-links">
                      {item.subItems.map((sub) => (
                        <li key={sub.label}>
                          <Link href={withLocalePrefix(sub.href, locale)}>{sub.label}</Link>
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
          <LanguageSwitcher />
          <Link href={contactCtaHref} className="action-btn">{t(locale, 'workWithUs')}</Link>
          <button 
            className="hamburger-btn" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={t(locale, 'toggleMenu')}
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
            <Link href={withLocalePrefix('/', locale)} onClick={() => setIsOpen(false)}>
              <img src="/images/agilemediasolutionslogo.png" alt="Agile Media Solutions" className="drawer-logo" />
            </Link>
            <button className="drawer-close" onClick={() => setIsOpen(false)} aria-label={t(locale, 'closeMenu')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <nav className="mobile-nav">
            <ul className="mobile-links">
              {navItems.map((item) => (
                <li key={item.label} className="mobile-item">
                  <Link href={withLocalePrefix(item.href, locale)} className="mobile-main-link">{item.label}</Link>
                  {item.subItems && (
                    <ul className="mobile-sublinks">
                      {item.subItems.map((sub) => (
                        <li key={sub.label}>
                          <Link href={withLocalePrefix(sub.href, locale)}>{sub.label}</Link>
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
