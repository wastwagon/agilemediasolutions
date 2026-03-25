'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin') {
      router.push('/admin');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin');
  };

  if (authorized === null) return null; // Or a loading spinner
  
  // Login page doesn't get the layout
  if (pathname === '/admin') return <>{children}</>;

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.72rem 0.95rem',
    borderRadius: '10px',
    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.82)',
    textDecoration: 'none',
    background: active ? 'linear-gradient(135deg, #2C504A, #3B6D66)' : 'transparent',
    border: active ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
    fontWeight: 600,
    letterSpacing: '0.01em',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #F7F8FA 0%, #EEF2F7 100%)' }}>
      {/* Sidebar */}
      <aside style={{ width: '272px', background: '#0F172A', color: '#fff', padding: '1.5rem 1rem', borderRight: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh' }}>
        <div style={{ marginBottom: '2.2rem', padding: '0 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <Image
            src="/images/agilemediasolutionslogo.png"
            alt="Agile Media"
            width={184}
            height={58}
            priority
            style={{
              width: '184px',
              height: 'auto',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1) contrast(1.06)',
              opacity: 0.95,
            }}
          />
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin/dashboard" style={navLinkStyle(pathname === '/admin/dashboard')}>Dashboard</Link>
          <Link href="/admin/brands" style={navLinkStyle(pathname === '/admin/brands')}>Brands</Link>
          <Link href="/admin/services" style={navLinkStyle(pathname === '/admin/services')}>Services</Link>
          <Link href="/admin/pages" style={navLinkStyle(pathname === '/admin/pages')}>Pages</Link>
          <Link href="/admin/media" style={navLinkStyle(pathname === '/admin/media')}>Media Library</Link>
          <Link href="/admin/events" style={navLinkStyle(pathname === '/admin/events')}>Events</Link>
          <Link href="/admin/case-studies" style={navLinkStyle(pathname === '/admin/case-studies')}>Case Studies</Link>
          <Link href="/admin/contacts" style={navLinkStyle(pathname === '/admin/contacts')}>Contact form</Link>
          <Link href="/admin/settings" style={navLinkStyle(pathname === '/admin/settings')}>Settings</Link>
          <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.12)', margin: '1.4rem 0' }} />
          <button onClick={handleLogout} style={{ padding: '0.7rem 0.95rem', borderRadius: '10px', color: '#FCA5A5', background: 'transparent', border: '1px solid rgba(252,165,165,0.25)', textAlign: 'left', cursor: 'pointer', fontWeight: 700 }}>Log out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <header style={{ height: '68px', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 10 }}>
          <span style={{ fontSize: '0.9rem', color: '#4B5563', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '999px', padding: '0.42rem 0.8rem' }}>
            Logged in as <strong style={{ color: '#111827' }}>{typeof window !== 'undefined' ? localStorage.getItem('admin_user') : ''}</strong>
          </span>
        </header>
        <div style={{ padding: '2rem 2.1rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
