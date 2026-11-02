# TASKS — Kebiasaan

Kerjakan **berurutan per fase**. Centang `[x]` setelah selesai dan memenuhi Definition of Done di `AGENTS.md`. Setiap fase diakhiri dengan verifikasi. Jangan lompat ke fase berikutnya sebelum verifikasi lulus.

## Fase 0 — Inisialisasi Proyek

- [x] Buat project Next.js (App Router, TypeScript, Tailwind, ESLint, `src/`) sesuai `TECH_STACK.md`
- [x] Pasang semua dependensi dan jalankan `npx flowbite-react@latest init`
- [x] Konfigurasi `tsconfig` strict, Prettier, Vitest, dan script `typecheck`/`test`
- [x] Buat struktur folder sesuai `ARCHITECTURE.md` (folder kosong boleh berisi `.gitkeep`)
- [x] Buat `.env.example`, `.gitignore` memuat `.env.local`
- [x] Catat versi terpasang di `TECH_STACK.md`
- **Verifikasi:** `npm run dev` jalan, `build`, `lint`, `typecheck` lulus.

## Fase 1 — Design System & Layout Dasar

- [ ] Muat font Outfit dan Plus Jakarta Sans lewat `next/font/google`
- [ ] Tulis token warna dan font di `globals.css` persis seperti `DESIGN_SYSTEM.md`; `<html lang="id" class="dark">`
- [ ] Buat `src/lib/theme.ts` (konstanta warna untuk chart) dan `src/lib/flowbite-theme.ts` (tema Flowbite: pill, rounded-3xl, warna primary)
- [ ] Komponen UI dasar: `BlobBackground`, `EmptyState`, `Skeletons`, `Pop`, `ChartCard`, `PageHeader`
- [ ] `AppShell`: sidebar (desktop) + `BottomNav` melayang (mobile) dengan 4 tab dan safe-area
- [ ] `MotionConfig reducedMotion="user"` di providers
- **Verifikasi:** halaman contoh menampilkan tombol, kartu, input, modal tanpa warna bawaan Flowbite; tampil benar di 360 / 768 / 1280px.

## Fase 2 — Firebase & Autentikasi

- [ ] `lib/firebase/client.ts` (init app, auth, Firestore dengan persistent cache)
- [ ] `lib/firebase/auth.ts` (register, login, logout, resetPassword, `mapAuthError`) dan `lib/firebase/users.ts` (`ensureUserDoc`)
- [ ] `AuthProvider`, hook `useAuth`, `AuthGuard`
- [ ] Halaman `/masuk`, `/daftar`, `/lupa-password` dengan react-hook-form + zod (`lib/schemas.ts`) dan pesan error sesuai `USER_FLOW.md`
- [ ] Redirect: `/` → `/hari-ini` atau `/masuk`; halaman auth redirect bila sudah login
- [ ] Tulis `firestore.rules` dan `firestore.indexes.json` sesuai `DATABASE_SCHEMA.md`
- **Verifikasi:** daftar, keluar, masuk, reset password berjalan; dokumen `users/{uid}` terbentuk; rute privat tertutup saat belum login.

## Fase 3 — Kelola Kebiasaan (CRUD)

- [x] Tipe di `src/types` (habit, log, user, stats) sesuai `DATABASE_SCHEMA.md`
- [x] `lib/date.ts` (+ test): `todayKey`, `weekKey`, `monthKey`, selisih hari, format Indonesia, rentang periode, minggu mulai Senin, zona waktu
- [x] `lib/firebase/habits.ts`: create, update, archive, delete (hapus log ikut terhapus dalam batch)
- [x] Hook `useHabits`
- [x] `HabitForm` (modal), `EmojiPicker`, `CategoryChip`, validasi zod
- [x] Halaman `/kebiasaan` (filter Semua/Baik/Buruk, tab Diarsipkan, aksi ubah/arsip/hapus dengan konfirmasi)
- **Verifikasi:** tambah, ubah, arsip, hapus kebiasaan berfungsi; hapus juga menghapus log; kategori tidak bisa diubah setelah dibuat.

## Fase 4 — Pencatatan Harian (Hari Ini)

- [x] `lib/gamification.ts` versi awal: fungsi streak dan hari bebas, `getEffectiveStreak`, `recomputeStreak` (+ test)
- [x] `lib/firebase/logs.ts`: `incrementLog`, `decrementLog`, `setMood` (writeBatch + `increment()`)
- [x] Hook `useTodayLogs`, `useToday` (otomatis berganti hari saat lewat tengah malam)
- [x] `HabitCard`, `CounterButton` (animasi pop, `aria-live`), `MoodPicker`
- [x] Halaman `/hari-ini` sesuai `USER_FLOW.md` (bagian baik/buruk, empty state, tombol "+ Kebiasaan")
- **Verifikasi:** hitungan bertambah dan berkurang benar, dokumen log memuat `date`, `weekKey`, `monthKey`, `category`; −1 sampai 0 menghapus dokumen; hari berganti dengan benar di zona `Asia/Jakarta`.

## Fase 5 — Gamifikasi

- [x] Lengkapi `lib/gamification.ts`: XP, level, gelar, streak harian, badge (`evaluateBadges`, `evaluateCleanBadges`) sesuai `GAMIFICATION.md`
- [x] Unit test lengkap sesuai daftar "Test Wajib"
- [x] Integrasikan hasil ke `incrementLog`/`decrementLog` (`LogResult`)
- [x] Hook `useUserProfile`
- [x] `StreakBadge`, `XpBar`, `BadgeGrid`, `BadgeToast`, `LevelUpModal`
- [x] Confetti untuk level up, badge baru, dan hari sempurna (hormati reduced motion)
- [x] Pesan motivasi acak dari `lib/copy.ts`
- [x] Halaman `/profil` (ubah nama, level, badge, keluar)
- **Verifikasi:** XP/level/streak/badge berubah sesuai aturan; koreksi −1 mengembalikan XP; confetti muncul sekali pada pemicu yang benar.

## Fase 6 — Dashboard

- [x] `lib/stats.ts` (+ test): agregasi log per hari/minggu/bulan, total baik/buruk, skor keseimbangan, selisih periode, top kebiasaan, distribusi mood, data heatmap
- [x] Hook `useLogsRange`
- [x] `PeriodTabs`, `SummaryCards`
- [x] `TrendChart` dan `ShareDonut` (ApexCharts via `next/dynamic`, `ssr: false`, tema dari `theme.ts`)
- [x] `CalendarHeatmap` (kustom, toggle Baik/Buruk, tooltip)
- [x] `TopHabits`, `MoodSummary`, `LevelCard`
- [x] Halaman `/dashboard` + skeleton + empty state
- [x] Halaman `/kebiasaan/[id]` (statistik, grafik 30 hari, riwayat, aksi)
- **Verifikasi:** angka dashboard cocok dengan data di Firestore untuk ketiga periode, termasuk pergantian minggu (Senin) dan bulan; grafik tampil benar di mobile.

## Fase 7 — PWA

- [ ] `app/manifest.ts` dan ikon (192, 512, maskable, apple-touch) sesuai `PWA.md`
- [ ] Service worker Serwist (nonaktif di dev), halaman `/offline`, `SwRegister` dengan toast pembaruan
- [ ] `OfflineBanner` dan `InstallPrompt` (Android + petunjuk iOS)
- [ ] Safe-area untuk `BottomNav` dan header
- **Verifikasi:** semua poin di "Checklist Verifikasi" pada `PWA.md`.

## Fase 8 — Polish, QA, dan Deploy

- [ ] Telusuri semua halaman: state loading, kosong, error; `error.tsx` per segmen
- [ ] Audit aksesibilitas: fokus, `aria-label`, kontras, target sentuh 44px
- [ ] Audit copy: semua Bahasa Indonesia, nada sesuai `DESIGN_SYSTEM.md`
- [ ] Cek 360 / 768 / 1280px dan `prefers-reduced-motion`
- [ ] Jalankan Lighthouse (PWA + Performance mobile)
- [ ] Deploy rules dan index Firebase; deploy ke Vercel; isi env var; tambahkan domain ke Authorized domains Firebase
- [ ] Uji end-to-end di produksi: daftar → tambah kebiasaan → catat → dashboard → pasang PWA → uji offline
- [ ] Tulis `README.md` singkat (cara menjalankan, setup Firebase, deploy)

## Pertanyaan Terbuka

> Agent: tulis di sini hal ambigu yang kamu temui beserta asumsi yang kamu pakai.

- (kosong)

## Ide Setelah v1 (jangan dikerjakan sekarang)

Pengingat/notifikasi push, backdate log, ekspor data CSV, login Google, tema tambahan, target harian per kebiasaan, perhitungan XP di Cloud Functions.
