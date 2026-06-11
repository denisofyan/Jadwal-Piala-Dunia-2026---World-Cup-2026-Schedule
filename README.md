# 🏆 Piala Dunia 2026 — Jadwal & Bagan WIB

Website jadwal resmi Piala Dunia FIFA 2026 dalam Waktu Indonesia Barat (WIB / UTC+7).  
Dibuat oleh **Maulana** · Deploy via Vercel.

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|------------|
| 📅 **Jadwal Lengkap** | 104 pertandingan dari Fase Grup hingga Final |
| 🏁 **Bendera Negara** | Emoji bendera semua 48 tim peserta |
| 🔴 **Live Badge** | Pertandingan aktif otomatis menyala merah |
| ⏱️ **Countdown** | Hitung mundur real-time menuju laga berikutnya |
| 🏆 **Bagan Knockout** | Bracket R32 → R16 → QF → SF → Final |
| 📊 **Klasemen Grup** | Tabel 12 grup (A–L) dengan statistik lengkap |
| 🔍 **Filter & Cari** | Filter per babak, kategori, dan pencarian nama tim |
| 🌙 **Dark Mode** | Desain premium dark dengan aksen emas |
| 📡 **API Live** | Skor & klasemen real-time via api-football.com |
| ♻️ **Auto-update** | Data refresh otomatis setiap 30 detik |

# 📺 Panduan Pengelolaan Stream — Jadwal Piala Dunia 2026

> Website: Jadwal Piala Dunia 2026 · Deploy: Vercel  
> Dibuat oleh: Maulana

---

## Cara Kerja Sistem Stream

```
Vercel Env Var (STREAM_DATA)
        ↓
/api/stream-data  ← serverless function, baca env var
        ↓
index.html (STREAM_LINKS)
        ↓
Tombol "TONTON SEKARANG" → Modal Pilihan → Player
```

- URL stream **tidak pernah ada di GitHub** — tersimpan aman di Vercel Environment Variables
- Untuk ganti/tambah stream, cukup edit env var → redeploy. **Tidak perlu sentuh kode.**

---

## Format STREAM_DATA

Isi env var `STREAM_DATA` adalah JSON satu baris dengan format:

```json
{
  "stream1": {"url": "URL_EMBED", "label": "Nama yang ditampilkan"},
  "stream2": {"url": "URL_EMBED", "label": "Nama yang ditampilkan"},
  "stream3": ...
}
```

**Key** (`stream1`, `stream2`, dst) bebas — hanya sebagai identifier internal.  
**`label`** adalah teks yang muncul di modal pilihan — isi sesuai kebutuhan (nama laga, film, siaran, dll).  
**`url`** harus berupa URL embed (bukan URL biasa).

---

## Cara Mendapatkan URL Embed YouTube

1. Buka video di YouTube
2. Klik **Share → Embed**
3. Salin bagian `src="..."` saja

Contoh:
```
URL biasa  : https://www.youtube.com/watch?v=KlxyByEkWE4
URL embed  : https://www.youtube.com/embed/KlxyByEkWE4  ✅
```

Untuk **live stream YouTube**, formatnya sama:
```
https://www.youtube.com/embed/ID_VIDEO_LIVE
```

---

## Cara Ganti / Tambah Stream

### 1. Buka Vercel Dashboard
Pergi ke: [vercel.com](https://vercel.com) → Login → Pilih project

### 2. Buka Environment Variables
`Settings` → `Environment Variables` → cari `STREAM_DATA`

### 3. Edit Nilainya

**Contoh: 2 pertandingan**
```json
{"stream1":{"url":"https://www.youtube.com/embed/ABC123","label":"Meksiko vs Afrika Selatan"},"stream2":{"url":"https://www.youtube.com/embed/XYZ456","label":"Korea Selatan vs Cekia"}}
```

**Contoh: 3 pertandingan**
```json
{"stream1":{"url":"https://www.youtube.com/embed/AAA","label":"Brasil vs Maroko"},"stream2":{"url":"https://www.youtube.com/embed/BBB","label":"Jerman vs Pantai Gading"},"stream3":{"url":"https://www.youtube.com/embed/CCC","label":"Argentina vs Aljazair"}}
```

**Contoh: kosongkan semua stream (tidak ada yang tayang)**
```json
{}
```

> ⚠️ Pastikan JSON valid — tidak ada koma di akhir, semua tanda kutip benar.  
> Gunakan [jsonlint.com](https://jsonlint.com) untuk validasi jika ragu.

### 4. Simpan → Redeploy

Setelah simpan, klik **Redeploy** (atau push commit baru ke GitHub).  
Env var baru aktif **hanya setelah redeploy**.

---

## Verifikasi Stream Sudah Aktif

Buka di browser:
```
https://domain-kamu.vercel.app/api/stream-data
```

Hasilnya harus JSON berisi stream yang kamu masukkan. Kalau masih `{}`, berarti belum redeploy.

---

## Perilaku Tombol "TONTON SEKARANG"

| Jumlah stream | Perilaku tombol |
|---|---|
| 0 stream | Scroll ke jadwal |
| 1 stream | Langsung buka player |
| 2+ stream | Tampilkan modal pilihan, user klik salah satu |

---

## Ringkasan Perubahan yang Sudah Dilakukan

| # | Perubahan | Keterangan |
|---|---|---|
| 1 | `getStream()` → `getStreams()` | Return array, support multi-stream per laga |
| 2 | `makeTontonBtn()` | Loop array streams, 1 stream = 1 tombol |
| 3 | Format env var | Dari `{key:{...}}` menjadi `{key:[{...}]}` lalu diubah lagi ke `{streamN:{...}}` |
| 4 | `initLiveBanner` dihapus | Diganti `updateLiveBanner()` — fix ReferenceError yang membuat JS crash |
| 5 | `scrollToNextStream()` | Tidak lagi matching ke jadwal — langsung baca `STREAM_LINKS` |
| 6 | `openStreamPicker()` | Modal pilihan stream baru |
| 7 | `pickStream()` / `closeStreamPicker()` | Handler pilihan stream |

---

## Troubleshooting

**Tombol tidak membuka modal**
→ Buka DevTools (F12) → Console, cari error merah
→ Pastikan tidak ada `ReferenceError` di baris INIT

**Stream kosong / tidak muncul pilihan**
→ Cek `/api/stream-data` — harus return JSON berisi stream
→ Pastikan sudah redeploy setelah edit env var

**Video tidak muncul di player**
→ Pastikan URL adalah format embed, bukan URL biasa YouTube
→ Cek apakah video/live stream masih aktif

**JSON error saat simpan env var**
→ Validasi di [jsonlint.com](https://jsonlint.com) sebelum paste ke Vercel
→ Pastikan semua dalam **satu baris** (tanpa newline)

---


## 📁 Struktur File

```
Jadwal-Piala-Dunia-2026---World-Cup-2026-Schedule/
├── api/
│   ├── fixtures.js
│   ├── standings.js
│   └── stream-data.js
├── index.html
├── vercel.json
└── README.md
```

---

## 🌐 Informasi Teknis

- **Zona Waktu:** Asia/Jakarta (WIB, UTC+7)
- **API Data:** [api-football.com](https://www.api-football.com) — Free tier, 100 req/hari
- **Fallback:** Data lokal jika API tidak tersedia / tanpa API key
- **Refresh:** Otomatis setiap 30 detik
- **Browser:** Chrome, Firefox, Edge, Safari (semua modern browser)
- **Mobile:** Responsive, optimal di semua ukuran layar

---

## 📅 Jadwal Turnamen

| Fase | Tanggal |
|------|---------|
| Fase Grup | 11 Jun – 27 Jun 2026 |
| 32 Besar (R32) | 28 Jun – 3 Jul 2026 |
| 16 Besar (R16) | 4 Jul – 7 Jul 2026 |
| Perempat Final | 9 Jul – 11 Jul 2026 |
| Semifinal | 14 Jul – 15 Jul 2026 |
| Perebutan Juara 3 | 18 Jul 2026 |
| **FINAL** | **19 Jul 2026** |

📍 Venue: **USA · Mexico · Canada**  
🏟️ Final: MetLife Stadium, New Jersey

---

**Deploy by Maulana** · 2026


## Vercel API Key Setup (PENTING)

API key tidak dipanggil dari `index.html`. Key harus disimpan di serverless environment variable Vercel.

1. Buka Vercel Project → Settings → Environment Variables
2. Tambahkan:

```text
API_FOOTBALL_KEY=isi_api_key_kamu
```

3. Environment: Production, Preview, Development (pilih semua kalau ada)
4. Klik Save
5. Redeploy project

Frontend akan memanggil:

```text
/api/fixtures?league=1&season=2026
/api/standings?league=1&season=2026
```

Serverless function di folder `api/` yang menambahkan header rahasia:

```text
x-apisports-key: process.env.API_FOOTBALL_KEY
```

Jadi API key tidak bocor ke browser dan tidak kena CORS direct-call.
