'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, animate } from 'framer-motion';
import { adminAuthHeaders, adminFetch } from '@/lib/adminApi';

function AnimatedCounter({ from = 0, to }: { from?: number, to: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(from, to, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          node.textContent = Math.round(value).toString();
        }
      });
      return () => controls.stop();
    }
  }, [from, to]);

  return <span ref={nodeRef} />;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ contacts: 0, brands: 0, services: 0, pages: 0, media: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactsRes, brandsRes, servicesRes, pagesRes, mediaRes] = await Promise.all([
          adminFetch('/api/admin/contacts', { headers: adminAuthHeaders() }),
          adminFetch('/api/brands'),
          adminFetch('/api/services'),
          adminFetch('/api/pages', { headers: adminAuthHeaders() }),
          adminFetch('/api/media', { headers: adminAuthHeaders() }),
        ]);
        const contacts = contactsRes.ok ? await contactsRes.json() : [];
        const brands = brandsRes.ok ? await brandsRes.json() : [];
        const services = servicesRes.ok ? await servicesRes.json() : [];
        const pages = pagesRes.ok ? await pagesRes.json() : [];
        const media = mediaRes.ok ? await mediaRes.json() : [];
        setStats({
          contacts: Array.isArray(contacts) ? contacts.length : 0,
          brands: Array.isArray(brands) ? brands.length : 0,
          services: Array.isArray(services) ? services.length : 0,
          pages: Array.isArray(pages) ? pages.length : 0,
          media: Array.isArray(media) ? media.length : 0,
        });
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
          <p style={{ fontFamily: 'DM Sans', color: '#6B7280' }}>Loading…</p>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  const statsCards = [
    { key: 'contacts', label: 'Contact messages', value: stats.contacts, href: '/admin/contacts', cta: 'View messages', accent: '#D76A49', tint: 'rgba(215, 106, 73, 0.13)', icon: '✉' },
    { key: 'brands', label: 'Brands', value: stats.brands, href: '/admin/brands', cta: 'Manage brands', accent: '#4F8F87', tint: 'rgba(79, 143, 135, 0.13)', icon: '◈' },
    { key: 'services', label: 'Services', value: stats.services, href: '/admin/services', cta: 'Manage services', accent: '#0D213B', tint: 'rgba(13, 33, 59, 0.08)', icon: '✦' },
    { key: 'pages', label: 'Pages', value: stats.pages, href: '/admin/pages', cta: 'Manage pages', accent: '#5B6472', tint: 'rgba(91, 100, 114, 0.1)', icon: '▣' },
    { key: 'media', label: 'Media assets', value: stats.media, href: '/admin/media', cta: 'Open media library', accent: '#2C504A', tint: 'rgba(44, 80, 74, 0.13)', icon: '◉' },
  ] as const;

  const commandCardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.86)',
    backdropFilter: 'blur(18px)',
    padding: '1.55rem 1.45rem',
    borderRadius: '18px',
    border: '1px solid rgba(229, 231, 235, 0.85)',
    boxShadow: '0 18px 40px -32px rgba(13, 33, 59, 0.45)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '210px'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', marginBottom: '0.5rem', color: '#0D213B' }}>Dashboard</h1>
        <p style={{ fontFamily: 'DM Sans', color: '#6B7280', fontSize: '1.1rem', marginBottom: '2.2rem' }}>Summary of content activity and management areas.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}
      >
        {statsCards.map((card) => (
          <motion.div
            key={card.key}
            variants={cardVariants}
            whileHover={{ y: -6, boxShadow: '0 14px 30px rgba(13, 33, 59, 0.1)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={commandCardStyle}
            className="kpi-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                {card.label}
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: card.tint,
                  color: card.accent,
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  border: '1px solid rgba(229,231,235,0.6)',
                }}
              >
                {card.icon}
              </span>
            </div>
            <span style={{ fontSize: '3.05rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 650, color: '#111827', lineHeight: 0.98, letterSpacing: '-0.02em' }}>
              <AnimatedCounter to={card.value} />
            </span>
            <Link href={card.href} className="magnetic" style={{ fontSize: '0.88rem', color: card.accent, textDecoration: 'none', fontWeight: 700, marginTop: 'auto', paddingTop: '0.8rem', display: 'inline-block' }}>
              {card.cta}
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <style jsx>{`
        .kpi-card::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, rgba(44, 80, 74, 0.0), rgba(44, 80, 74, 0.55), rgba(44, 80, 74, 0.0));
          opacity: 0.65;
        }
      `}</style>
    </div>
  );
}
