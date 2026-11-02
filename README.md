# Kebiasaan 🌅

Aplikasi pencatat kebiasaan (baik & buruk) bergaya Gen Z dengan tema **Sunset Lo-fi** (hangat, chill, soft & bubbly). Membantu anak muda memahami rutinitas sehari-hari tanpa rasa menghakimi, dilengkapi gamifikasi streak, level, XP, badge lencana, dan rekap statistik berkala.

---

## Fitur Utama

- 🔐 **Autentikasi Firebase:** Daftar, Masuk, Keluar, dan Reset Password dengan validasi ramah berbahasa Indonesia.
- 🌱 **Kelola Kebiasaan (Baik & Buruk):** Tambah kebiasaan baru dengan emoji kustom, catatan, tanggal mulai, filter kategori, serta arsip dan hapus.
- ⚡ **Pencatatan Cepat Hari Ini:** Tombol `+1` dan `-1` instan dengan animasi mikro pop, pemilihan mood (5 pilihan emoji), dan penghitungan otomatis streak & hari bebas.
- 🏆 **Gamifikasi Suportif:** 
  - XP dan Level bertahap (Pemula Santuy hingga Legenda Senja)
  - 9 lencana (Badges) unik dengan bonus XP
  - Animasi confetti untuk level-up, hari sempurna, dan badge baru (mendukung `prefers-reduced-motion`).
- 📊 **Dashboard Rekap:**
  - Pilihan periode: **Harian** (7 hari), **Mingguan** (8 minggu), **Bulanan** (6 bulan)
  - 4 kartu ringkasan dengan indikator tren perbandingan
  - Grafik batang berkelompok tren Baik vs Buruk (ApexCharts)
  - Grafik donat porsi keseimbangan
  - Heatmap kalender 20 minggu dengan intensitas warna
  - Top 5 kebiasaan dan distribusi mood
- 📱 **Progressive Web App (PWA):**
  - Installable di Android, iOS, dan Desktop
  - Standalone display dengan splash gelap hangat `#1C1917`
  - Cache offline & sinkronisasi otomatis Firestore
  - Halaman fallback `/offline`

---

## Tech Stack

| Kebutuhan | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 + TypeScript strict |
| **Styling** | Tailwind CSS v4 + Flowbite React (kustom tema Sunset Lo-fi) |
| **Database & Auth** | Firebase Authentication + Firestore (persistent multi-tab local cache) |
| **Grafik** | ApexCharts + react-apexcharts |
| **Animasi** | Motion (`motion/react`) + canvas-confetti |
| **Validasi Form** | react-hook-form + zod |
| **Tanggal** | date-fns (lokal Indonesia `id`, zona `Asia/Jakarta`, minggu mulai Senin) |
| **Ikon** | react-icons (Heroicons v2) |
| **PWA** | Web App Manifest + Service Worker (`public/sw.js`) |
| **Testing** | Vitest (pengujian unit logika murni) |

---

## Menjalankan di Lokal

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment Variable
Salin `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Isi konfigurasi Firebase milikmu:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Perintah Tersedia

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan Next.js development server |
| `npm run lint` | Menjalankan ESLint |
| `npm run typecheck` | Menjalankan TypeScript typecheck (`tsc --noEmit`) |
| `npm run test` | Menjalankan unit test logika murni dengan Vitest |
| `npm run build` | Membuat build produksi teroptimasi |
| `npm run start` | Menjalankan server hasil build produksi |

---

## Setup Firestore Rules & Index

File keamanan dan index sudah tersedia di root proyek:
- `firestore.rules` (isolasi data antar user & validasi field)
- `firestore.indexes.json` (index komposit riwayat log)

Deploy ke project Firebase menggunakan Firebase CLI:
```bash
npm i -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules,firestore:indexes
```

---

## Deploy ke Vercel

1. Push repository ke GitHub / GitLab.
2. Import project di [Vercel](https://vercel.com).
3. Tambahkan environment variables `NEXT_PUBLIC_FIREBASE_*` di Project Settings → Environment Variables.
4. Klik **Deploy**.
5. Setelah selesai, tambahkan domain Vercel ke **Firebase Console → Authentication → Settings → Authorized domains**.
