# TECH_STACK — Kebiasaan

> Gunakan versi **stabil terbaru** saat inisialisasi, lalu catat versi aktual di tabel "Versi Terpasang" di bawah. Cek dokumentasi resmi sebelum memakai API, jangan menebak.

## Stack

| Kebutuhan | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js (App Router) + React + TypeScript strict** | Rekomendasi: routing file-based, layout bersarang, deploy mulus di Vercel |
| Styling | **Tailwind CSS v4** | Dipakai Flowbite; token warna lewat `@theme` |
| UI kit | **flowbite-react** | Permintaan user; komponen siap pakai dan bisa di-tema |
| Database | **Firebase Firestore** | Permintaan user; realtime dan dukungan offline |
| Auth | **Firebase Authentication (Email/Password)** | Permintaan user |
| Grafik | **ApexCharts + react-apexcharts** | Dipakai di dokumentasi chart Flowbite sehingga gayanya serasi; mendukung bar, line, donut |
| Heatmap kalender | Komponen kustom (CSS grid) | Lebih ringan dan lebih mudah di-tema dibanding chart heatmap |
| Animasi | **motion** (sebelumnya framer-motion) | Spring animation untuk kesan bubbly |
| Confetti | **canvas-confetti** | Ringan, tanpa dependensi |
| Form & validasi | **react-hook-form + zod** | Validasi tipe-aman |
| Tanggal | **date-fns** (+ locale `id`) | Minggu mulai Senin, format Indonesia |
| Ikon | **react-icons** + emoji | react-icons dipakai di contoh Flowbite; emoji untuk kesan Gen Z |
| PWA | **Serwist** (service worker) + `app/manifest.ts` bawaan Next | Lihat `PWA.md` |
| Test | **Vitest** | Untuk logika murni di `src/lib` |
| Lint/format | ESLint (bawaan Next) + Prettier | |
| Deploy | **Vercel** | Permintaan user |

### Font

- **Outfit** untuk judul, angka besar, dan tombol (bulat, ramah, cocok konsep soft & bubbly).
- **Plus Jakarta Sans** untuk teks isi dan form (rapi, nyaman dibaca, akrab untuk pembaca Indonesia).
- Dimuat lewat `next/font/google` dengan `display: "swap"`, diekspos sebagai CSS variable `--font-outfit` dan `--font-jakarta`.

## Setup Awal

```bash
npx create-next-app@latest kebiasaan --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd kebiasaan
npm i flowbite-react firebase react-apexcharts apexcharts motion canvas-confetti \
      react-hook-form zod @hookform/resolvers date-fns react-icons
npm i -D vitest @types/canvas-confetti prettier
npx flowbite-react@latest init
```

PWA (lihat `PWA.md` untuk detail dan catatan kompatibilitas bundler):

```bash
npm i @serwist/next && npm i -D serwist
```

Catatan Flowbite React + Tailwind v4:
- Jalankan perintah `init` Flowbite, lalu pastikan `globals.css` memuat plugin Flowbite dan varian dark berbasis class: `@custom-variant dark (&:where(.dark, .dark *));`.
- `<html lang="id" class="dark">` di `app/layout.tsx`. Satu tema, tanpa toggle.
- Kustomisasi tema komponen lewat `createTheme` Flowbite React di `src/lib/flowbite-theme.ts`, agar warna bawaan (cyan/biru) tidak pernah muncul. Detail di `DESIGN_SYSTEM.md`.

## Environment Variable

`.env.example` (salin ke `.env.local`):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Nilai ini bukan rahasia (bagian dari konfigurasi klien Firebase); keamanan data dijaga oleh **Security Rules**, bukan dengan menyembunyikan key.

## Setup Firebase (dilakukan manual oleh user)

1. Buat project di Firebase Console, tambahkan **Web App**, salin config ke `.env.local`.
2. Aktifkan **Authentication → Sign-in method → Email/Password**.
3. Buat **Firestore Database** (mode production, region terdekat, misalnya `asia-southeast2` Jakarta).
4. Simpan rules dan index di repo: `firestore.rules`, `firestore.indexes.json` (isi di `DATABASE_SCHEMA.md`), lalu deploy:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase init firestore
   firebase deploy --only firestore:rules,firestore:indexes
   ```
5. Setelah deploy ke Vercel, tambahkan domain Vercel (dan domain kustom bila ada) ke **Authentication → Settings → Authorized domains**.

## Deploy ke Vercel

1. Push repo ke GitHub, import di Vercel (preset Next.js terdeteksi otomatis).
2. Isi semua `NEXT_PUBLIC_FIREBASE_*` di Project Settings → Environment Variables (Production dan Preview).
3. Deploy. Uji: daftar, tambah kebiasaan, catat, pasang sebagai PWA, uji offline.

## Script `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "format": "prettier --write ."
  }
}
```

(Sesuaikan jika versi Next yang terpasang mengubah perintah lint; yang penting keempat perintah di AGENTS.md tersedia.)

## Versi Terpasang

> Diisi agent setelah instalasi.

| Paket | Versi |
|---|---|
| next | 16.4.3 |
| react | 19.3.0 |
| tailwindcss | 4.1.18 |
| flowbite-react | 0.12.17 |
| firebase | 13.1.0 |
| react-apexcharts / apexcharts | 2.2.0 / 8.7.0 |
| motion | 14.9.0 |
| @serwist/next | 9.5.13 |
