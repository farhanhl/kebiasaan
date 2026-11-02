# PWA — Kebiasaan

Target: aplikasi bisa **dipasang** ke layar utama (Android, iOS, desktop), tampil **standalone**, punya **halaman offline**, dan **pencatatan tetap bisa dipakai offline** lalu tersinkron saat online.

> Cek dokumentasi Next.js (PWA guide) dan Serwist versi terbaru sebelum implementasi. Kompatibilitas Serwist dengan bundler yang dipakai Next (webpack vs Turbopack) bisa berubah antar versi. Jika `@serwist/next` tidak cocok dengan bundler default, gunakan opsi yang direkomendasikan dokumentasi Serwist untuk Turbopack, atau jalankan build dengan webpack. Fallback terakhir: service worker manual sederhana di `public/sw.js`. Catat keputusan di `TECH_STACK.md`.

## Manifest (`src/app/manifest.ts`)

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kebiasaan",
    short_name: "Kebiasaan",
    description: "Catat kebiasaan baik dan burukmu, pantau progresnya, naik level.",
    lang: "id",
    start_url: "/hari-ini",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1C1917",
    theme_color: "#1C1917",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

## Ikon

- `icon-192.png`, `icon-512.png`, `maskable-512.png` (konten inti di area aman 80% tengah), `apple-touch-icon.png` (180×180), dan favicon.
- Desain: latar gradien senja (`primary` → `secondary`) dengan simbol sederhana (mis. api kecil 🔥 atau centang bulat) dan sudut membulat. Boleh dibuat sebagai SVG lalu diekspor ke PNG.
- Metadata di `layout.tsx`: `appleWebApp: { capable: true, title: "Kebiasaan", statusBarStyle: "black-translucent" }`, `viewport.themeColor`, dan `viewportFit: "cover"`.
- Terapkan `env(safe-area-inset-*)` pada `BottomNav` dan header agar tidak tertutup notch/home indicator.

## Service Worker

Strategi caching (via Serwist):

| Jenis | Strategi |
|---|---|
| Aset build Next (`/_next/static`), font, ikon | Precache / CacheFirst |
| Halaman navigasi (HTML/RSC) | NetworkFirst dengan fallback ke cache, lalu `/offline` |
| Gambar statis | StaleWhileRevalidate |
| **Request Firestore & Firebase Auth** | **Jangan dicache oleh service worker** (NetworkOnly / diabaikan). Offline Firestore ditangani oleh SDK. |

Aturan:
- Service worker **nonaktif saat development** (`NODE_ENV !== "production"`) agar tidak membingungkan cache.
- Komponen `SwRegister` mendaftarkan SW di klien, dan menampilkan toast "Versi baru tersedia, muat ulang?" saat ada update (`skipWaiting` dikendalikan user).
- Halaman `/offline` dimasukkan ke precache.

## Offline Data (Firestore)

Di `src/lib/firebase/client.ts`:

```ts
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
```

Perilaku yang diharapkan:
- Data yang pernah dimuat tetap terbaca offline.
- Menekan **+** saat offline tetap menambah hitungan di UI; penulisan antre dan terkirim otomatis saat online.
- Karena itu `incrementLog` memakai `writeBatch` + `increment()`, bukan transaksi (transaksi membutuhkan koneksi).
- `OfflineBanner` muncul saat `navigator.onLine === false` (dan hilang saat online), dengan copy dari DESIGN_SYSTEM.
- Login baru dan daftar membutuhkan internet; tampilkan pesan jelas bila offline.

## Ajakan Pasang (Install Prompt)

`InstallPrompt`:
- Android/Chrome: tangkap event `beforeinstallprompt`, simpan, tampilkan banner/kartu kecil "Pasang Kebiasaan di layar utama 📲" dengan tombol "Pasang". Panggil `prompt()` saat tombol ditekan.
- iOS Safari (tidak ada event): tampilkan petunjuk "Ketuk ikon Bagikan lalu pilih *Tambah ke Layar Utama*".
- Muncul setelah user punya ≥ 1 log (bukan di kunjungan pertama), bisa ditutup, dan tidak muncul lagi selama 14 hari setelah ditutup (simpan di `localStorage`).
- Sembunyikan jika sudah berjalan standalone (`matchMedia("(display-mode: standalone)")`).

## Checklist Verifikasi

- [ ] Lighthouse: "Installable" lolos, tanpa error manifest.
- [ ] Terpasang di Android dan tampil standalone dengan splash warna `#1C1917`.
- [ ] iOS: "Tambah ke Layar Utama" berhasil, ikon dan nama benar.
- [ ] Mode pesawat: app terbuka, hitungan bisa ditambah, banner offline muncul.
- [ ] Setelah online kembali, data masuk ke Firestore (cek di Console).
- [ ] Halaman yang belum pernah dibuka saat offline menampilkan `/offline`.
- [ ] Update versi baru memunculkan toast pembaruan.
