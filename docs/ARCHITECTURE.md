# ARCHITECTURE — Kebiasaan

## Struktur Folder

```
kebiasaan/
├─ AGENTS.md
├─ docs/
├─ firestore.rules
├─ firestore.indexes.json
├─ public/
│  └─ icons/                 # icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png
└─ src/
   ├─ app/
   │  ├─ layout.tsx          # <html lang="id" class="dark">, font, providers
   │  ├─ globals.css         # token warna (@theme), varian dark, utilitas bubbly
   │  ├─ manifest.ts         # PWA manifest
   │  ├─ sw.ts               # service worker (Serwist)
   │  ├─ page.tsx            # splash + redirect (masuk → /hari-ini, belum → /masuk)
   │  ├─ offline/page.tsx
   │  ├─ (auth)/
   │  │  ├─ layout.tsx       # layout kartu tengah, blob dekoratif
   │  │  ├─ masuk/page.tsx
   │  │  ├─ daftar/page.tsx
   │  │  └─ lupa-password/page.tsx
   │  └─ (app)/
   │     ├─ layout.tsx       # AuthGuard + AppShell (sidebar desktop, bottom nav mobile)
   │     ├─ hari-ini/page.tsx
   │     ├─ dashboard/page.tsx
   │     ├─ kebiasaan/page.tsx
   │     ├─ kebiasaan/[id]/page.tsx
   │     └─ profil/page.tsx
   ├─ components/
   │  ├─ layout/             # AppShell, SidebarNav, BottomNav, PageHeader
   │  ├─ auth/               # LoginForm, RegisterForm, ForgotForm, AuthGuard
   │  ├─ habits/             # HabitCard, HabitForm (modal), HabitList, EmojiPicker, CounterButton, MoodPicker, CategoryChip
   │  ├─ dashboard/          # PeriodTabs, SummaryCards, TrendChart, ShareDonut, CalendarHeatmap, TopHabits, MoodSummary, LevelCard
   │  ├─ gamification/       # StreakBadge, XpBar, BadgeGrid, BadgeToast, LevelUpModal
   │  ├─ pwa/                # InstallPrompt, OfflineBanner, SwRegister
   │  └─ ui/                 # EmptyState, Skeletons, BlobBackground, Pop (wrapper animasi), ChartCard
   ├─ hooks/                 # useAuth, useHabits, useLogsRange, useTodayLogs, useUserProfile, useToast
   ├─ lib/
   │  ├─ firebase/
   │  │  ├─ client.ts        # init app, auth, firestore (persistent cache)
   │  │  ├─ auth.ts          # register, login, logout, resetPassword, mapAuthError
   │  │  ├─ users.ts
   │  │  ├─ habits.ts
   │  │  └─ logs.ts          # incrementLog, decrementLog, setMood (transaction)
   │  ├─ date.ts             # todayKey, weekKey, monthKey, rentang, format id
   │  ├─ gamification.ts     # XP, level, streak, badge (fungsi murni)
   │  ├─ stats.ts            # agregasi log → data grafik (fungsi murni)
   │  ├─ schemas.ts          # zod schema
   │  ├─ copy.ts             # bank kalimat (pesan motivasi, error, empty state)
   │  ├─ theme.ts            # konstanta warna untuk chart (selaras globals.css)
   │  └─ flowbite-theme.ts   # createTheme Flowbite
   ├─ providers/             # AuthProvider, ToastProvider, MotionConfig
   └─ types/                 # habit.ts, log.ts, user.ts, stats.ts
```

## Routing

| URL | Keterangan | Akses |
|---|---|---|
| `/` | Splash lalu redirect | publik |
| `/masuk`, `/daftar`, `/lupa-password` | Auth | publik (redirect ke `/hari-ini` bila sudah masuk) |
| `/hari-ini` | Catat harian, **halaman utama setelah login** | privat |
| `/dashboard` | Rekap harian/mingguan/bulanan | privat |
| `/kebiasaan` | Daftar & kelola kebiasaan | privat |
| `/kebiasaan/[id]` | Detail kebiasaan | privat |
| `/profil` | Profil, level, badge, keluar | privat |
| `/offline` | Fallback offline | publik |

Navigasi utama (4 tab): **Hari Ini · Kebiasaan · Dashboard · Profil**.

## Autentikasi & Proteksi Rute

- Firebase Auth berjalan di klien. `AuthProvider` memakai `onAuthStateChanged` dan menyediakan `{ user, loading }`.
- `AuthGuard` di `(app)/layout.tsx`: saat `loading` tampilkan splash; bila tidak ada user → `router.replace('/masuk')`.
- Halaman `(auth)` kebalikannya: bila sudah login → `/hari-ini`.
- Tidak memakai session cookie atau middleware di v1. Keamanan data ada di Firestore Rules.
- Saat register: buat user Auth → `updateProfile({ displayName })` → buat dokumen `users/{uid}` (lihat DATABASE_SCHEMA).

## Pola Data

- **Realtime lewat `onSnapshot`** dibungkus hook (`useHabits`, `useLogsRange`). Hook mengembalikan `{ data, loading, error }` dan selalu `unsubscribe` saat unmount.
- **Agregasi di klien.** Hook mengambil log pada rentang tanggal, lalu `lib/stats.ts` mengubahnya menjadi data grafik. Skala per user kecil, jadi tidak perlu agregasi di server.
- **Optimistic UI:** Firestore SDK dengan persistent cache sudah memunculkan perubahan lokal seketika; UI tidak perlu state ganda.
- **Offline:** `persistentLocalCache` + `persistentMultipleTabManager` diaktifkan di `client.ts`. Transaksi Firestore butuh koneksi, jadi `incrementLog` memakai `writeBatch` + `increment()` (lihat kontrak di bawah).

## Kontrak Service (`src/lib/firebase`)

```ts
// habits.ts
createHabit(uid: string, input: HabitInput): Promise<string>        // return habitId
updateHabit(uid: string, habitId: string, patch: HabitPatch): Promise<void>
setHabitArchived(uid: string, habitId: string, archived: boolean): Promise<void>
deleteHabit(uid: string, habitId: string): Promise<void>            // hapus habit + semua log-nya (batch ≤ 500)

// logs.ts
incrementLog(uid: string, habit: Habit, ctx: LogContext): Promise<LogResult>
decrementLog(uid: string, habit: Habit, ctx: LogContext): Promise<LogResult>
setMood(uid: string, habit: Habit, date: string, mood: Mood | null): Promise<void>

// users.ts
ensureUserDoc(user: User): Promise<void>
updateDisplayName(uid: string, name: string): Promise<void>
evaluateCleanBadges(uid: string, habits: Habit[], today: string): Promise<BadgeId[]>

// subscriptions (dipakai hooks)
subscribeHabits(uid, cb)
subscribeLogsRange(uid, startDate, endDate, cb)
subscribeUser(uid, cb)
```

`LogResult = { count: number; xpDelta: number; levelUp: boolean; newBadges: BadgeId[]; perfectDay: boolean }`. UI memakai hasil ini untuk memicu confetti, toast, dan modal level up.

### Alur `incrementLog`

1. Hitung `date = todayKey(tz)`, `docId = ${date}_${habit.id}`.
2. Baca log hari ini (dari cache/Firestore) dan profil user untuk hitungan XP dan streak.
3. Panggil fungsi murni di `lib/gamification.ts` untuk menghasilkan perubahan (XP, level, streak, badge baru).
4. Satu `writeBatch`: `set(log, { count: increment(1), ... }, { merge: true })`, `update(habit, {...})`, `update(user, {...})`.
5. Kembalikan `LogResult`.

> Karena memakai batch + `increment()`, tidak ada read-modify-write yang butuh koneksi, sehingga bekerja offline. Nilai turunan (streak, XP) dihitung dari snapshot terakhir yang ada di klien.

## Penanganan Error

- Semua fungsi service melempar error; hook/komponen menangkap dan menampilkan **Toast** berbahasa Indonesia dari `lib/copy.ts`.
- Error Auth dipetakan lewat `mapAuthError(code)`.
- Error boundary per segmen (`error.tsx`) dengan tampilan ramah dan tombol "Coba lagi".

## Performa

- Chart dimuat lewat `next/dynamic` dengan `ssr: false` (ApexCharts butuh `window`) dan skeleton saat memuat.
- Hanya satu listener Firestore per jenis data per halaman. Rentang dashboard dibatasi sesuai periode (lihat PRD F4).
- Gambar dan ikon PWA dioptimalkan; tidak ada gambar besar di UI (emoji dan SVG).
