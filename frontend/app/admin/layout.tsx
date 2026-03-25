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

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/brands', label: 'Brands' },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/pages', label: 'Pages' },
    { href: '/admin/media', label: 'Media Library' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/case-studies', label: 'Case Studies' },
    { href: '/admin/contacts', label: 'Contact form' },
    { href: '/admin/settings', label: 'Settings' },
  ];

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
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '1.05rem 1.15rem',
                  borderRadius: '14px',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  fontSize: '1.06rem',
                  border: active ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
                  background: active ? 'rgba(44, 80, 74, 0.92)' : 'transparent',
                  boxShadow: active
                    ? 'inset 0 0 0 1px rgba(255,255,255,0.06), 0 14px 26px rgba(0,0,0,0.35)'
                    : 'none',
                  textShadow: '0 1px 0 rgba(0,0,0,0.28)',
                  transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <header style={{ height: '68px', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.6rem', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 10 }}>
          <span style={{ fontSize: '0.9rem', color: '#4B5563', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '999px', padding: '0.42rem 0.8rem' }}>
            Logged in as <strong style={{ color: '#111827' }}>{typeof window !== 'undefined' ? localStorage.getItem('admin_user') : ''}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.46rem 0.82rem',
              borderRadius: '999px',
              color: '#B91C1C',
              background: '#FFFFFF',
              border: '1px solid rgba(185, 28, 28, 0.26)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.86rem',
            }}
          >
            Log out
          </button>
        </header>
        <div style={{ padding: '2rem 2.1rem' }}>
          {children}
        </div>
      </main>
      <style jsx>{`
      `}</style>
    </div>
  );
}
