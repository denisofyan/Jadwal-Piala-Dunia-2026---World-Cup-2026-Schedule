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

---

## 🔑 Cara Mendapatkan API Key (GRATIS)

Website ini terhubung ke **api-football.com** untuk mendapatkan skor live dan klasemen real-time.

### Langkah-langkah:

1. Buka **[https://www.api-football.com/#pricing](https://www.api-football.com/#pricing)**
2. Pilih paket **Free** (100 req/hari, cukup untuk website ini)
3. Kamu akan menerima API key melalui email
4. Buka file `index.html`, cari baris ini di bagian `<script>`:

```javascript
var API_KEY = 'YOUR_API_KEY'; // ← ISI API KEY DI SINI
```

5. Ganti `YOUR_API_KEY` dengan key yang kamu terima, contoh:

```javascript
var API_KEY = 'wc2026_abcdef1234567890'; // API key kamu
```

6. Simpan, lalu deploy ulang ke Vercel/GitHub

### ✅ Tanpa API Key

Website tetap berfungsi penuh **tanpa API key** — jadwal, filter, countdown, bagan, dan klasemen tetap tampil menggunakan data lokal yang sudah hardcoded. Yang tidak aktif hanya:
- Skor real-time di baris pertandingan
- Update klasemen grup otomatis

---

## 🚀 Deploy ke Vercel

### Cara 1 — Vercel CLI (Terminal)

```bash
npm install -g vercel
cd wc2026_enhanced
vercel
vercel --prod
```

### Cara 2 — Drag & Drop (Paling Mudah)

1. Buka [vercel.com](https://vercel.com) → Login
2. Klik **"Add New Project"**
3. Pilih **"Deploy without Git"** → drag folder `wc2026_enhanced` ke browser
4. Klik **Deploy** — selesai! ✅

### Cara 3 — GitHub + Vercel (Auto Deploy)

1. Upload folder `wc2026_enhanced` ke GitHub repository
2. Buka [vercel.com](https://vercel.com) → **"Add New Project"**
3. Import repository dari GitHub
4. Klik **Deploy** — setiap `git push` akan auto-deploy

---

## 📁 Struktur File

```
wc2026_enhanced/
├── index.html      ← Website utama + integrasi API
├── vercel.json     ← Konfigurasi Vercel
└── README.md       ← Dokumentasi ini
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
