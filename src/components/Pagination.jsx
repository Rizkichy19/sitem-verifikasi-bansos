import React from 'react';

/**
 * Pagination Komponen
 * @param {number}   currentPage  - Halaman aktif (1-indexed)
 * @param {number}   totalPages   - Total halaman
 * @param {Function} onPageChange - Callback: onPageChange(page)
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left  = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const btnBase = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '36px', height: '36px', borderRadius: '10px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
    transition: 'all 0.15s',
  };

  const btnActive = {
    ...btnBase,
    background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    border: '1px solid #3b82f6',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
  };

  const btnDisabled = { ...btnBase, opacity: 0.35, cursor: 'not-allowed' };

  return (
    <nav
      aria-label="Navigasi halaman"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={currentPage === 1 ? btnDisabled : btnBase}
        aria-label="Halaman sebelumnya"
      >
        ‹
      </button>

      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`e${i}`} style={{ ...btnBase, cursor: 'default', pointerEvents: 'none' }}>…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={page === currentPage ? btnActive : btnBase}
            aria-label={`Halaman ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={currentPage === totalPages ? btnDisabled : btnBase}
        aria-label="Halaman berikutnya"
      >
        ›
      </button>
    </nav>
  );
}
