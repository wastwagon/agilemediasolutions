'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, animate } from 'framer-motion';

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
      const token = localStorage.getItem('admin_token');
      try {
        const [contactsRes, brandsRes, servicesRes, pagesRes, mediaRes] = await Promise.all([
          fetch('/api/admin/contacts', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/brands'),
          fetch('/api/services'),
          fetch('/api/pages', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/media', { headers: { 'Authorization': `Bearer ${token}` } }),
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

  const commandCardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(16px)',
    padding: '2rem 1.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(229, 231, 235, 0.5)',
    boxShadow: '0 4px 20px rgba(13, 33, 59, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', marginBottom: '0.5rem', color: '#0D213B' }}>Dashboard</h1>
        <p style={{ fontFamily: 'DM Sans', color: '#6B7280', fontSize: '1.1rem', marginBottom: '3rem' }}>Summary of contact messages and published content.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}
      >
        <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(13, 33, 59, 0.08)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={commandCardStyle}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: 'rgba(215, 106, 73, 0.1)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', letterSpacing: '0.02em' }}>Contact messages</span>
          <span style={{ fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            <AnimatedCounter to={stats.contacts} />
          </span>
          <Link href="/admin/contacts" className="magnetic" style={{ fontSize: '0.85rem', color: '#D76A49', textDecoration: 'none', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem', display: 'inline-block' }}>View messages</Link>
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(13, 33, 59, 0.08)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={commandCardStyle}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: 'rgba(79, 143, 135, 0.1)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', letterSpacing: '0.02em' }}>Brands</span>
          <span style={{ fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            <AnimatedCounter to={stats.brands} />
          </span>
          <Link href="/admin/brands" className="magnetic" style={{ fontSize: '0.85rem', color: '#4F8F87', textDecoration: 'none', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem', display: 'inline-block' }}>Manage brands</Link>
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(13, 33, 59, 0.08)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={commandCardStyle}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: 'rgba(244, 235, 225, 0.6)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', letterSpacing: '0.02em' }}>Services</span>
          <span style={{ fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            <AnimatedCounter to={stats.services} />
          </span>
          <Link href="/admin/services" className="magnetic" style={{ fontSize: '0.85rem', color: '#0D213B', textDecoration: 'none', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem', display: 'inline-block' }}>Manage services</Link>
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(13, 33, 59, 0.08)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={commandCardStyle}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: 'rgba(235, 230, 221, 0.8)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', letterSpacing: '0.02em' }}>Pages</span>
          <span style={{ fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            <AnimatedCounter to={stats.pages} />
          </span>
          <Link href="/admin/pages" className="magnetic" style={{ fontSize: '0.85rem', color: '#0D213B', textDecoration: 'none', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem', display: 'inline-block' }}>Manage pages</Link>
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(13, 33, 59, 0.08)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={commandCardStyle}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: 'rgba(44, 80, 74, 0.12)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', letterSpacing: '0.02em' }}>Media assets</span>
          <span style={{ fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            <AnimatedCounter to={stats.media} />
          </span>
          <Link href="/admin/media" className="magnetic" style={{ fontSize: '0.85rem', color: '#2C504A', textDecoration: 'none', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem', display: 'inline-block' }}>Open media library</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
