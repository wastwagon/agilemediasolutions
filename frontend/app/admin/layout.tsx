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
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${active ? ' is-active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
          <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.12)', margin: '1.4rem 0' }} />
          <button onClick={handleLogout} className="admin-logout-btn">Log out</button>
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
      <style jsx>{`
        .admin-nav-link {
          position: relative;
          padding: 0.66rem 0.95rem;
          border-radius: 10px;
          color: #ffffff;
          text-decoration: none;
          border: 1px solid transparent;
          font-weight: 600;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
        }
        .admin-nav-link::before {
          content: '';
          position: absolute;
          left: -0.42rem;
          top: 0.56rem;
          width: 3px;
          height: calc(100% - 1.12rem);
          border-radius: 999px;
          background: #9be4d7;
          opacity: 0;
          transform: scaleY(0.75);
          transition: all 0.2s ease;
        }
        .admin-nav-link:hover {
          background: rgba(59, 109, 102, 0.28);
          border-color: rgba(255, 255, 255, 0.14);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 8px 18px rgba(0, 0, 0, 0.22);
        }
        .admin-nav-link:hover::before {
          opacity: 0.7;
          transform: scaleY(1);
        }
        .admin-nav-link.is-active {
          background: linear-gradient(135deg, #2c504a, #3b6d66);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 24px rgba(44, 80, 74, 0.35);
        }
        .admin-nav-link.is-active::before {
          opacity: 1;
          transform: scaleY(1);
        }
        .admin-logout-btn {
          padding: 0.66rem 0.95rem;
          border-radius: 10px;
          color: #fca5a5;
          background: transparent;
          border: 1px solid rgba(252, 165, 165, 0.25);
          text-align: left;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .admin-logout-btn:hover {
          background: rgba(252, 165, 165, 0.08);
          border-color: rgba(252, 165, 165, 0.45);
        }
      `}</style>
    </div>
  );
}
