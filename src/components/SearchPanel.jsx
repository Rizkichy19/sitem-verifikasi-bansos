import React from 'react';
import { KECAMATAN_LIST } from '../constants/kecamatan';

export default function SearchPanel({ selectedKecamatan, onKecamatanChange, onSearch, isLoading }) {
  return (
    <section style={styles.card} aria-label="Panel Pencarian Calon Pengganti">

      {/* Heading */}
      <div style={styles.heading}>
        <div style={styles.iconWrap} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '15px', margin: 0 }}>Pencarian Calon Pengganti</h2>
          <p style={{ color: 'rgba(147,197,253,0.7)', fontSize: '12px', marginTop: '2px' }}>
            Menampilkan warga dari Data Mentah yang belum ada di Data Verval
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={e => { e.preventDefault(); onSearch(); }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}
      >
        {/* Dropdown */}
        <div style={{ flex: '1 1 220px' }}>
          <label htmlFor="select-kecamatan" style={styles.label}>Pilih Kecamatan</label>
          <div style={{ position: 'relative' }}>
            <select
              id="select-kecamatan"
              value={selectedKecamatan}
              onChange={e => onKecamatanChange(e.target.value)}
              disabled={isLoading}
              style={styles.select}
            >
              <option value="" disabled style={styles.option}>-- Pilih Kecamatan --</option>
              {KECAMATAN_LIST.map(k => <option key={k} value={k} style={styles.option}>{k}</option>)}
            </select>
            <div style={styles.chevron} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Button */}
        <div>
          <button
            id="btn-cari-pengganti"
            type="submit"
            disabled={isLoading || !selectedKecamatan}
            style={isLoading || !selectedKecamatan ? styles.btnDisabled : styles.btn}
          >
            {isLoading ? (
              <><span style={styles.spinner} />Memproses...</>
            ) : (
              <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Cari Calon Pengganti
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
        {[
          '📥 NIK kosong tetap ditampilkan',
          '🔄 NIK ada di Verval → disembunyikan',
          '⚡ Data di-cache setelah fetch pertama',
        ].map(t => (
          <span key={t} style={styles.chip}>{t}</span>
        ))}
      </div>
    </section>
  );
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', padding: '24px',
    animation: 'fadeIn 0.4s ease-out',
  },
  heading: { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' },
  iconWrap: {
    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.3)',
  },
  label: { display: 'block', color: '#93c5fd', fontSize: '12px', fontWeight: '600', marginBottom: '8px' },
  select: {
    width: '100%', padding: '12px 40px 12px 16px', borderRadius: '12px',
    background: '#0f2044', border: '1px solid rgba(99,163,255,0.25)',
    color: '#e2e8f0', fontSize: '14px', fontWeight: '500', outline: 'none',
    appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
    colorScheme: 'dark',
  },
  option: {
    background: '#0f2044',
    color: '#e2e8f0',
  },
  chevron: {
    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
    fontWeight: '700', fontSize: '14px', color: '#fff',
    background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
  },
  btnDisabled: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'not-allowed',
    fontWeight: '700', fontSize: '14px', color: 'rgba(255,255,255,0.5)',
    background: 'rgba(37,99,235,0.2)', whiteSpace: 'nowrap',
  },
  spinner: {
    display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    animation: 'spin 0.8s linear infinite',
  },
  chip: {
    fontSize: '11px', padding: '4px 12px', borderRadius: '20px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b',
  },
};
