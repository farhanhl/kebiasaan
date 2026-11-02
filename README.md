# Kebiasaan

Aplikasi pelacak kebiasaan (*habit tracker*) berbasis web yang dirancang dengan pendekatan suportif dan non-judgmental. Membantu pengguna membangun kebiasaan baik dan mengurangi kebiasaan buruk melalui pencatatan harian yang ringan, sistem gamifikasi terukur, serta visualisasi data komprehensif.

---

## Fitur Utama

- **Autentikasi & Keamanan**: Masuk, daftar, keluar, dan pemulihan kata sandi menggunakan Firebase Authentication dengan validasi formulir dan aturan keamanan Firestore berbasis pengguna (*per-user security rules*).
- **Manajemen Kebiasaan**: Tambah, ubah, arsipkan, dan kategorikan kebiasaan (Baik atau Buruk) dilengkapi pemilihan ikon emoji, catatan motivasi, serta tanggal mulai.
- **Pencatatan Harian Cepat**: Tombol hitungan instan (+1 / -1), pencatatan suasana hati (*mood tracking*), serta kalkulasi otomatis streak dan hari bebas kebiasaan buruk.
- **Sistem Gamifikasi Suportif**: Progresi non-punitif dengan perolehan XP, 5 tingkatan level, 9 lencana (*badges*), dan animasi perayaan yang mendukung preferensi *reduced motion*.
- **Dashboard Analisis**: Rekap performa lintas periode (harian, mingguan, bulanan), rasio keseimbangan, pemeringkatan kebiasaan teratas, dan *heatmap* konsistensi 20 minggu (ApexCharts).
- **Progressive Web App (PWA)**: Dukungan instalasi lintas perangkat (Android, iOS, Desktop), cache *offline-first* via Service Worker, dan sinkronisasi otomatis dengan Cloud Firestore.

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS v4, Flowbite React, Custom Theme (Sunset Lo-fi) |
| **Database & Auth** | Firebase Authentication, Cloud Firestore (Multi-Tab Persistent Cache) |
| **Visualisasi Data** | ApexCharts, React-ApexCharts |
| **Animasi** | Motion (`motion/react`), Canvas-Confetti |
| **Validasi Formulir** | React Hook Form, Zod |
| **Waktu & Tanggal** | date-fns (Zona: `Asia/Jakarta`, Minggu dimulai dari Senin) |
| **Ikon** | React Icons (Heroicons v2) |
| **Testing** | Vitest |

---

## Struktur Proyek

```text
kebiasaan/
├── docs/                      # Dokumentasi teknis, PRD, dan arsitektur
├── public/                    # Aset statis, ikon PWA, dan Service Worker
│   ├── icons/                 # Aset ikon PWA (192px, 512px, maskable)
│   └── sw.js                  # Service Worker untuk caching offline
├── src/
│   ├── app/                   # Halaman dan tata letak Next.js App Router
│   │   ├── (app)/             # Rute terotentikasi (Hari Ini, Kebiasaan, Dashboard, Profil)
│   │   ├── (auth)/            # Rute autentikasi (Masuk, Daftar, Lupa Password)
│   │   └── globals.css        # Konfigurasi token tema Tailwind CSS
│   ├── components/            # Komponen antarmuka React
│   │   ├── auth/              # Formulir autentikasi dan route guard
│   │   ├── dashboard/         # Grafik analitik dan kartu ringkasan
│   │   ├── gamification/      # Komponen level, XP bar, dan lencana
│   │   ├── habits/            # Kartu kebiasaan, tombol hitungan, dan formulir
│   │   ├── layout/            # Shell navigasi, header, dan bottom bar
│   │   ├── pwa/               # Banner offline dan dialog instalasi
│   │   └── ui/                # Komponen dasar bersama
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Logika bisnis murni, utilitas, dan integrasi Firebase
│   │   ├── __tests__/         # Unit test logika murni (Vitest)
│   │   ├── firebase/          # Konfigurasi client dan fungsi Firestore
│   │   ├── date.ts            # Utilitas kalkulasi tanggal dan zona waktu
│   │   ├── gamification.ts    # Algoritma streak, XP, level, dan badge
│   │   └── stats.ts           # Logika agregasi statistik dashboard
│   ├── providers/             # React Context Providers
│   └── types/                 # Definisi tipe data TypeScript
├── firestore.rules            # Aturan keamanan Cloud Firestore
├── firestore.indexes.json     # Indeks komposit Cloud Firestore
└── vitest.config.mts          # Konfigurasi pengujian unit Vitest
```

---

## Memulai Proyek

### Prasyarat

- Node.js versi 20.x atau lebih baru
- npm versi 10.x atau lebih baru
- Proyek Firebase dengan Authentication (Email/Password) dan Cloud Firestore yang telah aktif

### 1. Kloning dan Instalasi

```bash
git clone https://github.com/farhanhl/kebiasaan.git
cd kebiasaan
npm install
```

### 2. Konfigurasi Environment Variables

Salin file contoh konfigurasi:

```bash
cp .env.example .env.local
```

Lengkapi kredensial Firebase proyek Anda pada file `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Menjalankan Server Pengembangan

```bash
npm run dev
```

Akses aplikasi melalui browser di [http://localhost:3000](http://localhost:3000).

---

## Skrip yang Tersedia

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Next.js (Turbopack) |
| `npm run build` | Mengompilasi build produksi dengan prerendering statis |
| `npm run start` | Menjalankan server dari hasil kompilasi produksi |
| `npm run lint` | Menjalankan analisis kode statis dengan ESLint |
| `npm run typecheck` | Menjalankan pemeriksaan tipe statis TypeScript (`tsc --noEmit`) |
| `npm run test` | Menjalankan seluruh rangkaian pengujian unit dengan Vitest |

---

## Konfigurasi Firestore Rules & Indexes

Terapkan aturan keamanan dan indeks komposit ke Firebase menggunakan Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes
```

---

## Panduan Deployment ke Vercel

1. Unggah repositori ke GitHub atau penyedia Git lainnya.
2. Buka [Vercel](https://vercel.com) dan impor repositori proyek ini.
3. Pada menu **Project Settings → Environment Variables**, tambahkan seluruh variabel `NEXT_PUBLIC_FIREBASE_*` sesuai dengan isi `.env.local`.
4. Jalankan proses **Deploy**.
5. Setelah URL produksi aktif, daftarkan domain tersebut ke **Firebase Console → Authentication → Settings → Authorized domains**.

---

## Lisensi

Proyek ini dirilis di bawah lisensi MIT.
