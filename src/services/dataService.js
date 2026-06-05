import Papa from 'papaparse';

const MENTAH_ID = '1cqf5nm6VdjCHI_yWSJ6M2XX870x7hsgRrQwlHU2NE_E';
const VERVAL_ID = '1n3pk7LJLu5G5RhPSvvEeBACtMCODfGGXSPcg2UIr9q0';

/**
 * WAJIB DIISI! 
 * Ini adalah pemetaan (mapping) GID untuk masing-masing tab kecamatan di Data Verval.
 * 
 * CARA MENGISI: 
 * Buka Google Sheets Data Verval, klik tab kecamatan di bawah (misal: "Verval sesuai PMK BANDUNGAN").
 * Lihat pada URL di bagian atas browser, perhatikan teks di akhir URL yang bertuliskan: `gid=12345678`
 * Salin angka tersebut dan masukkan ke dalam tanda petik di bawah ini.
 */
const VERVAL_GID_MAP = {
  'Ambarawa':      '275058936',  // Ini sudah benar (contoh)
  'Bancak':        '901908458', // TODO: Masukkan GID untuk Bancak
  'Bandungan':     '325737708', // TODO: Masukkan GID untuk Bandungan
  'Banyubiru':     '477875422', // TODO: Masukkan GID untuk Banyubiru
  'Bawen':         '1834880358', // TODO: Masukkan GID untuk Bawen
  'Bergas':        '1142743424', // TODO: Masukkan GID untuk Bergas
  'Getasan':       '1489323240', // TODO: Masukkan GID untuk Getasan
  'Jambu':         '1668702026', // TODO: Masukkan GID untuk Jambu
  'Kaliwungu':     '763388663', // TODO: Masukkan GID untuk Kaliwungu
  'Sumowono':      '1742901354', // TODO: Masukkan GID untuk Sumowono
  'Suruh':         '1772208970', // TODO: Masukkan GID untuk Suruh
  'Susukan':       '810250959', // TODO: Masukkan GID untuk Susukan
  'Tengaran':      '1904876666', // TODO: Masukkan GID untuk Tengaran
  'Tuntang':       '733398396', // TODO: Masukkan GID untuk Tuntang
  'Ungaran Barat': '1459717515', // TODO: Masukkan GID untuk Ungaran Barat
  'Ungaran Timur': '1449029472', // TODO: Masukkan GID untuk Ungaran Timur
};

export const COL = { NAMA:'NAMA', NIK:'NIK', ALAMAT:'ALAMAT', DESA:'DESA', KECAMATAN:'KECAMATAN' };

let cacheMentah = null;
export function clearCache() { cacheMentah = null; }

// ── 1. NORMALISASI STRING (ATURAN MUTLAK 1) ──
function normalizeString(val) {
  if (val === null || val === undefined) return '';
  // Ubah ke lowercase, buang semua karakter selain huruf & angka (termasuk spasi), dan trim
  return String(val).toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
}

// ── Fetch CSV via PapaParse (Native Download) ──
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    // Tambahkan cache buster
    const finalUrl = url.includes('?') ? `${url}&_cb=${Date.now()}` : `${url}?_cb=${Date.now()}`;
    
    Papa.parse(finalUrl, {
      download: true,
      header: false,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(new Error(`Gagal memuat CSV: ${err.message}`))
    });
  });
}

// ── MAIN LOGIC ───────────────────────────────────────────────
export async function fetchCalonPengganti(kecamatan, onProgress) {
  onProgress?.(0, 3);

  // ══════════════════════════════════════════════════════════
  // SUMBER 1: DATA MENTAH
  // ══════════════════════════════════════════════════════════
  if (!cacheMentah) {
    const urlMentah = `https://docs.google.com/spreadsheets/d/${MENTAH_ID}/export?format=csv`;
    const allRows = await fetchCSV(urlMentah);
    
    // Cari baris header secara otomatis
    const KEYS = ['NAMA','NIK','KECAMATAN','ALAMAT'];
    let bestScore = 0, headerIdx = 0;
    allRows.slice(0, 25).forEach((row, i) => {
      const upper = row.map(c => String(c).toUpperCase());
      const score = KEYS.filter(k => upper.some(c => c.includes(k))).length;
      if (score > bestScore) { bestScore = score; headerIdx = i; }
    });

    const headers = allRows[headerIdx].map(h => String(h).trim().toUpperCase());
    
    const idxNama = headers.findIndex(h => h.includes('NAMA'));
    const idxNIK  = headers.findIndex(h => h.includes('NIK'));
    const idxAlamat = headers.findIndex(h => h.includes('ALAMAT'));
    const idxDesa = headers.findIndex(h => h.includes('DESA') || h.includes('KELURAHAN'));
    const idxKec  = headers.findIndex(h => h.includes('KECAMATAN') || h.includes('KEC'));

    if (idxKec === -1 || idxNIK === -1 || idxNama === -1) {
      throw new Error("Gagal menemukan kolom KECAMATAN, NAMA, atau NIK di Data Mentah.");
    }

    const dataRows = allRows.slice(headerIdx + 1);
    cacheMentah = { dataRows, idxNama, idxNIK, idxAlamat, idxDesa, idxKec };
  }
  onProgress?.(1, 3);

  const { dataRows: mentahRows, idxNama, idxNIK, idxAlamat, idxDesa, idxKec } = cacheMentah;
  
  // Ambil hanya data Mentah untuk kecamatan terpilih (Normalisasi komparasi)
  const normKecamatanPilihan = normalizeString(kecamatan);
  const dataMentahKec = mentahRows.filter(r => {
    return normalizeString(r[idxKec]) === normKecamatanPilihan;
  });

  // ══════════════════════════════════════════════════════════
  // SUMBER 2: DATA VERVAL (WAJIB PAKAI GID)
  // ══════════════════════════════════════════════════════════
  const gid = VERVAL_GID_MAP[kecamatan];
  if (gid === undefined || gid === '') {
    throw new Error(`GID untuk kecamatan "${kecamatan}" BELUM DIISI! Silakan buka file dataService.js dan isi VERVAL_GID_MAP dengan GID yang benar dari URL Google Sheets.`);
  }

  const urlVerval = `https://docs.google.com/spreadsheets/d/${VERVAL_ID}/export?format=csv&gid=${gid}`;
  let vervalNIKs = new Set();
  let vervalNamas = new Set();
  let vervalRowCount = 0;

  try {
    const vRows = await fetchCSV(urlVerval);
    
    if (vRows.length > 0) {
      // Cari index kolom NAMA dan NIK dari 5 baris pertama (antisipasi pergeseran tabel)
      let headerRowIdx = 0;
      let vIdxNama = -1;
      let vIdxNIK = -1;

      for (let i = 0; i < Math.min(20, vRows.length); i++) {
        const rowUpper = vRows[i].map(c => String(c).toUpperCase());
        const n = rowUpper.findIndex(c => c === 'NAMA' || c.includes('NAMA'));
        const nk = rowUpper.findIndex(c => c === 'NIK' || c.includes('NIK'));
        if (n !== -1 || nk !== -1) {
          vIdxNama = n;
          vIdxNIK = nk;
          headerRowIdx = i;
          break;
        }
      }

      const dataRowsVerval = vRows.slice(headerRowIdx + 1);
      vervalRowCount = dataRowsVerval.filter(r => r.some(cell => String(cell).trim() !== '')).length;

      dataRowsVerval.forEach(row => {
        // Ambil dan Normalisasi NAMA Verval
        if (vIdxNama !== -1) {
          const nama = normalizeString(row[vIdxNama]);
          if (nama) vervalNamas.add(nama);
        } else {
          // Fallback ekstraksi (brute-force nama)
          row.forEach(cell => {
             const str = normalizeString(cell);
             if (str && isNaN(cell)) vervalNamas.add(str);
          });
        }
        
        // Ambil dan Normalisasi NIK Verval
        if (vIdxNIK !== -1) {
          const nikRaw = normalizeString(row[vIdxNIK]);
          if (nikRaw) vervalNIKs.add(nikRaw);
        } else {
           // Fallback ekstraksi (brute-force NIK)
          row.forEach(cell => {
            const nik = normalizeString(cell);
            if (nik && !isNaN(nik) && nik.length >= 10) vervalNIKs.add(nik);
          });
        }
      });
    }
  } catch (e) {
    throw new Error(`Gagal memuat Data Verval: ${e.message}`);
  }
  
  onProgress?.(2, 3);

  // ══════════════════════════════════════════════════════════
  // KOMPARASI FINAL: ATURAN EKSKLUSI & INKLUSI MUTLAK
  // ══════════════════════════════════════════════════════════
  const hasil = dataMentahKec.filter(r => {
    // 1. Ekstrak Data Mentah menggunakan Normalisasi Mutlak
    const namaMentah = normalizeString(r[idxNama]);
    const nikMentah  = normalizeString(r[idxNIK]);
    
    // 2. ATURAN EKSKLUSI (WAJIB): 
    // JIKA Nama Mentah ada di himpunan Nama Verval -> BUANG (return false)
    if (namaMentah && vervalNamas.has(namaMentah)) {
      return false; 
    }

    // JIKA NIK Mentah ada di himpunan NIK Verval -> BUANG (return false)
    if (nikMentah && vervalNIKs.has(nikMentah)) {
      return false; 
    }

    // 3. ATURAN INKLUSI (MUTLAK):
    // Jika tidak tertangkap eksklusi di atas, MAKA WAJIB DITAMPILKAN.
    // Kami TIDAK MEMFILTER panjang NIK, format NIK kosong, dsb. 
    // Selama dia belum di-verval, dia adalah calon pengganti.
    return true; 
  });

  // Susun data murni (tanpa modifikasi) untuk ditampilkan ke tabel UI
  const hasilNorm = hasil.map(r => ({
    [COL.NAMA]:      String(r[idxNama]   || '').trim(),
    [COL.NIK]:       String(r[idxNIK]    || '').trim(),
    [COL.ALAMAT]:    String(r[idxAlamat] || '').trim(),
    [COL.DESA]:      String(r[idxDesa]   || '').trim(),
    [COL.KECAMATAN]: String(r[idxKec]    || kecamatan).trim(),
  }));

  onProgress?.(3, 3);

  return {
    hasil: hasilNorm,
    stats: {
      totalMentah         : dataMentahKec.length,
      totalVerval         : vervalRowCount,
      totalCalonPengganti : hasil.length,
    },
  };
}
