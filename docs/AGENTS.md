# AGENTS.md — Kebiasaan

Kamu adalah AI agent yang membangun **Kebiasaan**, aplikasi pencatat kebiasaan (baik & buruk) bergaya Gen Z. File ini adalah pintu masuk. Baca dulu seluruhnya, lalu baca dokumen di `docs/` sesuai urutan di bawah.

## Ringkasan Produk

User mendaftar (email/password), mencatat kebiasaannya (kategori **baik** atau **buruk**), lalu setiap kali melakukannya menekan tombol untuk menambah hitungan hari itu. Dashboard menampilkan rekap harian, mingguan, dan bulanan. Ada elemen gamifikasi: streak, XP, level, badge, mood tracker, copy santai, dan animasi mikro.

## Urutan Baca Dokumen

1. `docs/PRD.md` — apa yang dibangun dan batasannya
2. `docs/TECH_STACK.md` — library, setup, environment variable, deploy
3. `docs/ARCHITECTURE.md` — struktur folder, routing, pola kode, kontrak service
4. `docs/DATABASE_SCHEMA.md` — struktur Firestore, security rules, index
5. `docs/DESIGN_SYSTEM.md` — warna, font, bentuk, komponen Flowbite, copywriting
6. `docs/USER_FLOW.md` — alur dan spesifikasi per halaman
7. `docs/GAMIFICATION.md` — aturan streak, XP, level, badge
8. `docs/PWA.md` — manifest, service worker, offline
9. `docs/TASKS.md` — checklist pengerjaan. **Kerjakan berurutan dari sini.**

## Aturan Wajib

1. **Bahasa:** seluruh teks UI dalam **Bahasa Indonesia** (santai, tidak menggurui). Identifier kode, nama file komponen, dan komentar teknis memakai bahasa Inggris. URL halaman memakai bahasa Indonesia (lihat ARCHITECTURE).
2. **TypeScript strict.** Dilarang memakai `any`. Gunakan tipe dari `src/types`.
3. **UI hanya dari Flowbite React + Tailwind.** Jangan menambah library UI lain. Jika komponen Flowbite tidak ada, buat komponen kustom dengan Tailwind dan token dari DESIGN_SYSTEM.
4. **Dilarang hardcode warna** (hex/rgb) di komponen. Pakai token Tailwind yang didefinisikan di `globals.css` (lihat DESIGN_SYSTEM). Satu-satunya tempat hex boleh muncul: `globals.css`, `manifest.ts`, dan konfigurasi chart (yang mengambil dari konstanta `src/lib/theme.ts`).
5. **Satu tema saja** (gelap hangat Sunset Lo-fi). Tidak ada toggle light/dark. Elemen `<html>` selalu punya class `dark` agar varian `dark:` Flowbite aktif.
6. **Semua akses Firebase hanya lewat `src/lib/firebase/*`.** Komponen dan halaman tidak boleh memanggil Firestore/Auth SDK langsung. Pakai hooks di `src/hooks`.
7. **Tanggal selalu lewat `src/lib/date.ts`** dengan zona waktu user (default `Asia/Jakarta`). Jangan pakai `new Date().toISOString().slice(0, 10)` karena menghasilkan tanggal UTC dan akan salah di malam hari WIB.
8. **Logika murni** (streak, XP, level, agregasi statistik, tanggal) ditaruh di `src/lib/*` sebagai fungsi murni tanpa efek samping dan **wajib punya unit test** (Vitest).
9. **Jangan menambah fitur** di luar `docs/PRD.md`. Jika ada ide atau hal yang ambigu, tulis di bagian "Pertanyaan Terbuka" pada `docs/TASKS.md` dan lanjutkan dengan asumsi paling sederhana.
10. **Jangan menebak API.** Sebelum memakai Next.js, Flowbite React, Firebase, Serwist, atau ApexCharts, cek dokumentasi versi terbaru. Versi yang terpasang dicatat di `docs/TECH_STACK.md` setelah instalasi.
11. **Aksesibilitas dan gerak:** semua tombol ikon punya `aria-label`; hormati `prefers-reduced-motion` (nonaktifkan confetti dan animasi besar).
12. **Mobile-first.** Rancang untuk lebar 360px dulu, lalu perluas ke `md` dan `lg`.
13. **Tidak ada secret di repo.** Konfigurasi Firebase lewat `.env.local` (`NEXT_PUBLIC_*`). Sediakan `.env.example`.

## Perintah

```bash
npm run dev        # development
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # Vitest (logika murni di src/lib)
npm run build      # build production
```

## Definition of Done (per task)

- `npm run lint`, `npm run typecheck`, `npm run test`, dan `npm run build` lulus tanpa error.
- Tampilan sudah dicek di 360px, 768px, dan 1280px.
- Ada state loading (skeleton/spinner), state kosong, dan state error untuk setiap data yang diambil.
- Copy mengikuti panduan di DESIGN_SYSTEM.
- Checkbox task di `docs/TASKS.md` sudah dicentang.

## Konvensi Kode

- Komponen: `PascalCase.tsx`, satu komponen utama per file. Hook: `useXxx.ts`. Util: `camelCase.ts`.
- Server Component secara default; tambahkan `"use client"` hanya jika perlu (hook, event, Firebase, chart).
- Form: `react-hook-form` + `zod`. Skema validasi terpusat di `src/lib/schemas.ts`.
- Commit kecil dan bermakna (Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`).
