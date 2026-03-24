'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, animate } from 'framer-motion';

// Physical kinetic counter hook 
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
  const [stats, setStats] = useState({ contacts: 0, brands: 0, services: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('admin_token');
      try {
        const [contactsRes, brandsRes, servicesRes] = await Promise.all([
          fetch('/api/admin/contacts', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/brands'),
          fetch('/api/services')
        ]);
        if (contactsRes.ok && brandsRes.ok && servicesRes.ok) {
          const [contacts, brands, services] = await Promise.all([
            contactsRes.json(),
            brandsRes.json(),
            servicesRes.json()
          ]);
          setStats({ contacts: contacts.length, brands: brands.length, services: services.length });
        }
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
          <p style={{ fontFamily: 'DM Sans', letterSpacing: '2px', color: '#6B7280' }}>SYNCHRONIZING...</p>
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
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', marginBottom: '0.5rem', color: '#0D213B' }}>Command Center</h1>
        <p style={{ fontFamily: 'DM Sans', color: '#6B7280', fontSize: '1.1rem', marginBottom: '3rem' }}>Welcome to the Agile Media Solution global management hub.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}
      >
        <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(13, 33, 59, 0.08)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={commandCardStyle}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: 'rgba(215, 106, 73, 0.1)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', letterSpacing: '1px' }}>TOTAL CONTACTS</span>
          <span style={{ fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            <AnimatedCounter to={stats.contacts} />
          </span>
          <Link href="/admin/contacts" className="magnetic" style={{ fontSize: '0.85rem', color: '#D76A49', textDecoration: 'none', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem', display: 'inline-block' }}>View Pipeline →</Link>
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(13, 33, 59, 0.08)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={commandCardStyle}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: 'rgba(79, 143, 135, 0.1)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', letterSpacing: '1px' }}>BRANDS MANAGED</span>
          <span style={{ fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            <AnimatedCounter to={stats.brands} />
          </span>
          <Link href="/admin/brands" className="magnetic" style={{ fontSize: '0.85rem', color: '#4F8F87', textDecoration: 'none', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem', display: 'inline-block' }}>Manage Portfolio →</Link>
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(13, 33, 59, 0.08)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={commandCardStyle}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: 'rgba(244, 235, 225, 0.6)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', letterSpacing: '1px' }}>SERVICES LISTED</span>
          <span style={{ fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            <AnimatedCounter to={stats.services} />
          </span>
          <Link href="/admin/services" className="magnetic" style={{ fontSize: '0.85rem', color: '#0D213B', textDecoration: 'none', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem', display: 'inline-block' }}>Edit Capabilities →</Link>
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(13, 33, 59, 0.08)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={commandCardStyle}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: 'rgba(235, 230, 221, 0.8)', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', letterSpacing: '1px' }}>DYNAMIC PAGES</span>
          <span style={{ fontSize: '3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            <AnimatedCounter to={11} />
          </span>
          <Link href="/admin/pages" className="magnetic" style={{ fontSize: '0.85rem', color: '#0D213B', textDecoration: 'none', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem', display: 'inline-block' }}>Author Content →</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
