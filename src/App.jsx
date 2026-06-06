import React, { useState } from 'react';
import Header     from './components/Header';
import SearchPanel from './components/SearchPanel';
import ResultTable from './components/ResultTable';
import StatsCard   from './components/StatsCard';
import { fetchCalonPengganti } from './services/dataService';

export default function App() {
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [isLoading,  setIsLoading]  = useState(false);
  const [hasil,      setHasil]      = useState([]);
  const [stats,      setStats]      = useState(null);
  const [hasSearched,setHasSearched]= useState(false);
  const [searchedKec,setSearchedKec]= useState('');
  const [error,      setError]      = useState(null);
  const [progress,   setProgress]   = useState({ step: 0, total: 3 });

  const STEP_LABELS = [
    'Mengambil Data Mentah...',
    'Memfilter berdasarkan kecamatan...',
    'Mengambil Data Verval & membandingkan NIK...',
    'Selesai!',
  ];

  const handleSearch = async () => {
    if (!selectedKecamatan) return;
    setIsLoading(true);
    setError(null);
    setHasSearched(false);
    setStats(null);
    setProgress({ step: 0, total: 3 });

    try {
      const { hasil: data, stats: s } = await fetchCalonPengganti(
        selectedKecamatan,
        (step, total) => setProgress({ step, total })
      );
      setHasil(data);
      setStats(s);
      setSearchedKec(selectedKecamatan);
      setHasSearched(true);
    } catch (err) {
      console.error('[DBHCHT]', err);
      setError(err.message || 'Terjadi kesalahan. Pastikan spreadsheet bersifat publik (anyone with link).');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Background blobs */}
      <div style={styles.blobWrap} aria-hidden="true">
        <div style={{ ...styles.blob, top: '-160px', left: '-160px', background: 'radial-gradient(circle,#2563eb,transparent 70%)', width: '500px', height: '500px' }} />
        <div style={{ ...styles.blob, top: '50%', right: '-160px', background: 'radial-gradient(circle,#7c3aed,transparent 70%)', width: '400px', height: '400px', opacity: 0.12 }} />
      </div>

      <Header />

      <main style={styles.main}>

        {/* Search panel */}
        <SearchPanel
          selectedKecamatan={selectedKecamatan}
          onKecamatanChange={setSelectedKecamatan}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Loading state */}
        {isLoading && (
          <div style={styles.loadingCard} role="status" aria-live="polite">
            <div style={styles.spinRing} />
            <div>
              <p style={{ color: '#93c5fd', fontWeight: '700', fontSize: '15px', margin: '0 0 4px' }}>
                {STEP_LABELS[progress.step] || 'Memproses...'}
              </p>
              {/* Progress bar */}
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.round((progress.step / progress.total) * 100)}%`,
                  }}
                />
              </div>
              <p style={{ color: '#475569', fontSize: '12px', marginTop: '6px' }}>
                Langkah {progress.step} / {progress.total}
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div style={styles.errorCard} role="alert">
            <span style={{ fontSize: '24px' }}>❌</span>
            <div>
              <p style={{ color: '#fca5a5', fontWeight: '700', margin: '0 0 4px' }}>Gagal Mengambil Data</p>
              <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
              <p style={{ color: '#64748b', fontSize: '12px', marginTop: '8px' }}>
                💡 Pastikan kedua Google Spreadsheet sudah diset <strong style={{ color: '#94a3b8' }}>"Anyone with the link can view"</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Stats row */}
        {stats && !isLoading && (
          <div style={styles.statsRow}>
            <StatsCard icon="📋" label="Data Mentah Kecamatan"    value={stats.totalMentah}          color="#3b82f6" bgColor="rgba(37,99,235,0.12)" />
            <StatsCard icon="✅" label="Sudah Ada di Data Verval" value={stats.totalVerval}           color="#f59e0b" bgColor="rgba(245,158,11,0.12)" />
            <StatsCard icon="🎯" label="Calon Pengganti"          value={stats.totalCalonPengganti}   color="#22c55e" bgColor="rgba(34,197,94,0.12)"  />
          </div>
        )}

        {/* Result table */}
        {hasSearched && !isLoading && !error && (
          <ResultTable data={hasil} kecamatanLabel={searchedKec} />
        )}

        {/* Welcome placeholder */}
        {!hasSearched && !isLoading && !error && (
          <div style={styles.placeholder}>
            <div style={styles.placeholderIcon}>👥</div>
            <h3 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px', margin: '0 0 8px' }}>
              Siap Mencari Calon Pengganti
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', lineHeight: 1.7, margin: '0 0 24px' }}>
              Pilih <span style={{ color: '#60a5fa' }}>Kecamatan</span> dari dropdown, lalu klik{' '}
              <span style={{ color: '#60a5fa' }}>Cari Calon Pengganti</span>. Sistem akan membandingkan
              Data Mentah dengan Data Verval dan menampilkan warga yang belum masuk Verval.
            </p>
            {/* Steps */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {[
                { n: '1', t: 'Pilih Kecamatan', c: '#3b82f6' },
                { n: '2', t: 'Klik Cari', c: '#8b5cf6' },
                { n: '3', t: 'Lihat Calon Pengganti', c: '#22c55e' },
              ].map(s => (
                <div key={s.n} style={{ ...styles.stepChip, borderColor: `${s.c}30` }}>
                  <span style={{ ...styles.stepNum, color: s.c, background: `${s.c}20` }}>{s.n}</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>{s.t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <footer style={styles.footer} role="contentinfo">
        <p style={{ color: '#334155', fontSize: '12px', margin: 0 }}>
          © 2025 Dinas Sosial Kabupaten Semarang · Sistem Pencarian Calon Pengganti DBHCHT · TKSK
        </p>
      </footer>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    background: 'radial-gradient(ellipse at top left,#0f2044 0%,#0a1628 50%,#040d1a 100%)',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  blobWrap: { position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 },
  blob: { position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.18 },
  main: {
    position: 'relative', zIndex: 1, flex: 1,
    maxWidth: '1200px', width: '100%', margin: '0 auto',
    padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: '20px',
  },
  loadingCard: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px', padding: '40px 32px',
    display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
    animation: 'fadeIn 0.4s ease-out',
  },
  spinRing: {
    width: '52px', height: '52px', flexShrink: 0, borderRadius: '50%',
    border: '4px solid rgba(37,99,235,0.15)',
    borderTop: '4px solid #3b82f6', borderRight: '4px solid #60a5fa',
    animation: 'spin 1s linear infinite',
  },
  progressTrack: {
    width: '260px', height: '6px', borderRadius: '99px',
    background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
  },
  progressBar: {
    height: '100%', borderRadius: '99px',
    background: 'linear-gradient(90deg,#2563eb,#60a5fa)',
    transition: 'width 0.4s ease',
  },
  errorCard: {
    background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '20px', padding: '24px',
    display: 'flex', alignItems: 'flex-start', gap: '16px',
    animation: 'fadeIn 0.4s ease-out',
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px',
  },
  placeholder: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px', padding: '60px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
    animation: 'fadeIn 0.4s ease-out',
  },
  placeholderIcon: { fontSize: '48px', marginBottom: '18px' },
  stepChip: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 16px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid',
  },
  stepNum: {
    width: '26px', height: '26px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '800',
  },
  footer: {
    position: 'relative', zIndex: 1,
    textAlign: 'center', padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
};
