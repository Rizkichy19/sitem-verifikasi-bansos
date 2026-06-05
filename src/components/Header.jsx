import React from 'react';

export default function Header() {
  return (
    <header role="banner">
      {/* Accent bar */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg,#1d4ed8 0%,#60a5fa 50%,#f59e0b 100%)' }} />

      <div style={styles.wrap}>
        <div style={styles.inner}>
          {/* Icon */}
          <div style={styles.iconBox} aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h1 style={styles.title}>Sistem Pencarian Calon Pengganti DBHCHT</h1>
            <p style={styles.subtitle}>Dinas Sosial Kabupaten Semarang · Tim TKSK</p>
          </div>

          {/* Badge */}
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={styles.badge}>DBHCHT 2026</span>
            <span style={{ color: 'rgba(147,197,253,0.5)', fontSize: '11px' }}>Data Verval Real-time</span>
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  wrap: {
    background: 'linear-gradient(135deg,rgba(15,32,68,0.97) 0%,rgba(26,58,107,0.95) 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto', padding: '18px 24px',
    display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
  },
  iconBox: {
    width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    boxShadow: '0 4px 18px rgba(37,99,235,0.45)',
  },
  title: {
    color: '#f1f5f9', fontWeight: '800', fontSize: 'clamp(15px,2.5vw,22px)',
    margin: 0, lineHeight: 1.2,
  },
  subtitle: { color: '#93c5fd', fontSize: '13px', marginTop: '3px', fontWeight: '500' },
  badge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
    background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#fbbf24',
  },
};
