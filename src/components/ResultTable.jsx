import React, { useState, useMemo, useEffect } from 'react';
import Pagination from './Pagination';
import { COL } from '../services/dataService';

const PAGE_SIZE = 50;

/**
 * ResultTable — Tabel hasil dengan Live Search + Pagination
 * @param {Array}  data           - Semua hasil filter
 * @param {string} kecamatanLabel - Label kecamatan (untuk header)
 */
export default function ResultTable({ data, kecamatanLabel }) {
  const [query,       setQuery]       = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset ke halaman 1 kalau data atau query berubah
  useEffect(() => { setCurrentPage(1); }, [data, query]);

  // Filter by nama (live search)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(row =>
      (row[COL.NAMA] || '').toLowerCase().includes(q)
    );
  }, [data, query]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart   = (currentPage - 1) * PAGE_SIZE;
  const pageData    = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // ── Empty state ──────────────────────────────────────────────
  if (data.length === 0) {
    return (
      <div style={styles.emptyWrap} role="status">
        <div style={styles.emptyIcon}>⚠️</div>
        <h3 style={styles.emptyTitle}>Tidak Ada Calon Pengganti</h3>
        <p style={styles.emptyDesc}>
          Semua warga di <span style={{ color: '#fbbf24' }}>Kec. {kecamatanLabel}</span> sudah
          tercatat di Data Verval, atau data belum tersedia.
        </p>
      </div>
    );
  }

  return (
    <section style={styles.card} aria-label="Tabel calon pengganti penerima bansos">

      {/* ── Header bar ── */}
      <div style={styles.headerBar}>
        <div>
          <h2 style={styles.headerTitle}>Calon Pengganti — Kec. {kecamatanLabel}</h2>
          <p style={styles.headerSub}>
            {filtered.length} dari {data.length} data ditampilkan
            {query && ` · filter: "${query}"`}
          </p>
        </div>
        <span style={styles.badge}>{data.length} Total</span>
      </div>

      {/* ── Search box ── */}
      <div style={styles.searchWrap}>
        <div style={styles.searchInner}>
          <svg style={{ flexShrink: 0 }} width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="input-search-nama"
            type="text"
            placeholder="Cari nama..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={styles.searchInput}
            aria-label="Cari berdasarkan nama"
          />
          {query && (
            <button onClick={() => setQuery('')} style={styles.clearBtn} aria-label="Hapus pencarian">✕</button>
          )}
        </div>
        <span style={styles.pageInfo}>
          Hal. {currentPage}/{totalPages} · {PAGE_SIZE} baris/hal.
        </span>
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table} aria-label="Data calon pengganti bansos DBHCHT">
          <thead>
            <tr style={styles.theadRow}>
              {['NO', 'NAMA', 'NIK', 'ALAMAT', 'DESA/KEL.', 'KECAMATAN'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                  Tidak ada hasil untuk "{query}"
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr
                  key={`${row[COL.NIK] || i}-${pageStart + i}`}
                  style={{
                    ...styles.tr,
                    animationDelay: `${Math.min(i * 20, 400)}ms`,
                  }}
                  className="table-row-animate"
                >
                  <td style={{ ...styles.td, textAlign: 'center', width: '48px' }}>
                    <span style={styles.numBadge}>{pageStart + i + 1}</span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: '500', color: '#f1f5f9', minWidth: '160px' }}>
                    {row[COL.NAMA] || '—'}
                  </td>
                  <td style={{ ...styles.td, minWidth: '170px' }}>
                    <span style={styles.nikBadge}>{row[COL.NIK] || <em style={{ color: '#64748b' }}>Kosong</em>}</span>
                  </td>
                  <td style={{ ...styles.td, color: '#94a3b8', minWidth: '160px' }}>
                    {row[COL.ALAMAT] || '—'}
                  </td>
                  <td style={{ ...styles.td, minWidth: '120px' }}>
                    <span style={styles.desaBadge}>{row[COL.DESA] || '—'}</span>
                  </td>
                  <td style={{ ...styles.td, color: '#7dd3fc', minWidth: '120px' }}>
                    {row[COL.KECAMATAN] || kecamatanLabel}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div style={styles.paginationWrap}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ── Footer ── */}
      <div style={styles.footer}>
        <span>📋 Sumber: Google Sheets · NIK kosong tetap ditampilkan · NIK yang ada di Data Verval disembunyikan</span>
      </div>
    </section>
  );
}

// ── Inline styles (konsisten dengan dark theme) ──────────────
const styles = {
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    overflow: 'hidden',
    animation: 'slideUp 0.5s ease-out',
  },
  headerBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '12px',
    padding: '18px 24px',
    background: 'linear-gradient(90deg,rgba(37,99,235,0.12) 0%,rgba(15,32,68,0.2) 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  headerTitle: { color: '#f1f5f9', fontWeight: '700', fontSize: '15px', margin: 0 },
  headerSub: { color: 'rgba(147,197,253,0.7)', fontSize: '12px', marginTop: '2px' },
  badge: {
    padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700',
    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80',
  },
  searchWrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
    padding: '14px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  searchInner: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '8px 14px', minWidth: '220px',
  },
  searchInput: {
    background: 'transparent', border: 'none', outline: 'none',
    color: '#e2e8f0', fontSize: '14px', width: '200px',
  },
  clearBtn: {
    background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '12px', padding: '0 2px',
  },
  pageInfo: { color: '#475569', fontSize: '12px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  th: {
    padding: '12px 20px', textAlign: 'left', fontSize: '11px',
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#60a5fa',
    whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' },
  td: { padding: '13px 20px', fontSize: '13px', color: '#cbd5e1', verticalAlign: 'middle' },
  numBadge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '28px', height: '28px', borderRadius: '8px', fontSize: '11px', fontWeight: '700',
    background: 'rgba(37,99,235,0.18)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.2)',
  },
  nikBadge: {
    fontFamily: 'monospace', fontSize: '12px', padding: '3px 10px', borderRadius: '8px',
    background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)',
  },
  desaBadge: {
    fontSize: '12px', padding: '3px 10px', borderRadius: '20px',
    background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)',
  },
  paginationWrap: { padding: '18px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' },
  footer: {
    padding: '10px 24px', fontSize: '11px', color: '#475569',
    borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.1)',
  },
  emptyWrap: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px', padding: '60px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
  },
  emptyIcon: { fontSize: '40px', marginBottom: '16px' },
  emptyTitle: { color: '#f1f5f9', fontWeight: '700', fontSize: '16px', margin: '0 0 8px' },
  emptyDesc: { color: '#64748b', fontSize: '14px', maxWidth: '360px', lineHeight: '1.6' },
};
