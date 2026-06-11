/**
 * inject-streams.js
 * Dijalankan saat build Vercel (bukan di browser, tidak masuk GitHub publik).
 * 
 * Cara kerja:
 *   1. Baca environment variable STREAM_DATA dari Vercel
 *   2. Sisipkan sebagai <script>window.STREAM_DATA = {...}</script> ke index.html
 *   3. Hasilnya: URL stream tertanam di HTML yang di-serve, tapi TIDAK ada di repo
 * 
 * Format STREAM_DATA (set di Vercel Dashboard → Settings → Environment Variables):
 *   {"Meksiko|Afrika Selatan":{"url":"https://...","label":"Tonton"},"Korea Selatan|Cekia":{"url":"https://...","label":"Tonton"}}
 */

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');

// Ambil env var STREAM_DATA — wajib diset di Vercel Dashboard
const raw = process.env.STREAM_DATA;

if (!raw) {
  console.log('[inject-streams] STREAM_DATA tidak ditemukan — tombol Tonton tidak akan muncul.');
  // Tetap jalan tanpa error, halaman tetap render normal
  process.exit(0);
}

// Validasi JSON
let streamData;
try {
  streamData = JSON.parse(raw);
} catch (e) {
  console.error('[inject-streams] STREAM_DATA bukan JSON valid:', e.message);
  console.error('  Nilai diterima:', raw.slice(0, 200));
  process.exit(1);
}

console.log('[inject-streams] Stream ditemukan:', Object.keys(streamData).length, 'pertandingan');
Object.keys(streamData).forEach(k => console.log('  -', k));

// Baca index.html
let html = fs.readFileSync(htmlPath, 'utf8');

// Hapus inject lama jika ada (untuk re-deploy)
html = html.replace(/<!-- STREAM_INJECT_START -->[\s\S]*?<!-- STREAM_INJECT_END -->\n?/g, '');

// Buat script inject
const injectScript = `<!-- STREAM_INJECT_START -->
<script>window.STREAM_DATA=JSON.parse(${JSON.stringify(JSON.stringify(streamData))});</script>
<!-- STREAM_INJECT_END -->`;

// Sisipkan tepat sebelum </head>
if (!html.includes('</head>')) {
  console.error('[inject-streams] Tidak menemukan </head> di index.html');
  process.exit(1);
}

html = html.replace('</head>', injectScript + '\n</head>');

// Tulis balik
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('[inject-streams] ✅ Berhasil inject ke index.html');
