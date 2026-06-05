import React from 'react';

/**
 * LoadingSpinner Komponen
 * Ditampilkan saat proses pengambilan data sedang berjalan.
 */
export default function LoadingSpinner() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label="Sedang memuat data"
    >
      {/* Animated ring */}
      <div className="relative w-16 h-16 mb-5">
        <div
          className="absolute inset-0 rounded-full border-4"
          style={{ borderColor: 'rgba(37,99,235,0.15)' }}
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin-slow"
          style={{
            borderTopColor: '#3b82f6',
            borderRightColor: '#60a5fa',
          }}
        />
        {/* Inner pulse */}
        <div className="absolute inset-3 rounded-full bg-blue-500/20 animate-pulse" />
      </div>

      <p className="text-blue-200 font-semibold text-sm">Mengambil dan memproses data...</p>
      <p className="text-blue-400/60 text-xs mt-1">Mohon tunggu sebentar</p>
    </div>
  );
}
