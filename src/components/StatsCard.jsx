import React from 'react';

/**
 * StatsCard Komponen
 * Kartu kecil untuk menampilkan ringkasan statistik.
 */
export default function StatsCard({ icon, label, value, color = '#3b82f6', bgColor = 'rgba(37,99,235,0.12)' }) {
  return (
    <div
      className="glass-card rounded-2xl p-5 flex items-center gap-4 animate-fade-in"
      role="region"
      aria-label={`${label}: ${value}`}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
        style={{ background: bgColor, border: `1px solid ${color}40` }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs font-medium">{label}</p>
        <p className="text-white text-xl font-bold mt-0.5 leading-none">{value}</p>
      </div>
    </div>
  );
}
