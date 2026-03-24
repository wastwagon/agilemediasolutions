'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#111827', color: '#fff', padding: '2rem 1rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', marginBottom: '3rem', padding: '0 1rem' }}>Agile Admin</h1>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin/dashboard" style={{ padding: '0.75rem 1rem', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: pathname === '/admin/dashboard' ? '#374151' : 'transparent' }}>Dashboard</Link>
          <Link href="/admin/brands" style={{ padding: '0.75rem 1rem', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: pathname === '/admin/brands' ? '#374151' : 'transparent' }}>Brands</Link>
          <Link href="/admin/services" style={{ padding: '0.75rem 1rem', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: pathname === '/admin/services' ? '#374151' : 'transparent' }}>Services</Link>
          <Link href="/admin/pages" style={{ padding: '0.75rem 1rem', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: pathname === '/admin/pages' ? '#374151' : 'transparent' }}>Pages</Link>
          <Link href="/admin/events" style={{ padding: '0.75rem 1rem', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: pathname === '/admin/events' ? '#374151' : 'transparent' }}>Events</Link>
          <Link href="/admin/case-studies" style={{ padding: '0.75rem 1rem', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: pathname === '/admin/case-studies' ? '#374151' : 'transparent' }}>Case Studies</Link>
          <Link href="/admin/contacts" style={{ padding: '0.75rem 1rem', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: pathname === '/admin/contacts' ? '#374151' : 'transparent' }}>Contact Messages</Link>
          <Link href="/admin/settings" style={{ padding: '0.75rem 1rem', borderRadius: '6px', color: '#fff', textDecoration: 'none', background: pathname === '/admin/settings' ? '#374151' : 'transparent' }}>Settings</Link>
          <hr style={{ border: 'none', height: '1px', background: '#374151', margin: '2rem 0' }} />
          <button onClick={handleLogout} style={{ padding: '0.75rem 1rem', borderRadius: '6px', color: '#EF4444', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}>Log Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <header style={{ height: '64px', background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 2rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Logged in as <strong style={{color: '#111'}}>{typeof window !== 'undefined' ? localStorage.getItem('admin_user') : ''}</strong></span>
        </header>
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
