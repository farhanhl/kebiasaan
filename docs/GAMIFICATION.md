# GAMIFICATION — Kebiasaan

Semua logika di file ini diimplementasikan sebagai **fungsi murni** di `src/lib/gamification.ts` dan **wajib punya unit test**. Konstanta ditaruh di bagian atas file agar mudah disetel.

## Filosofi

Memberi rasa progres tanpa membuat user merasa dihukum. Kebiasaan buruk **tidak mengurangi XP** dan tidak memicu pesan negatif; yang dihargai adalah kejujuran mencatat dan hari bebas.

## Konstanta

```ts
export const XP_PER_GOOD_LOG = 10;
export const XP_DAILY_CAP_PER_HABIT = 10;   // hanya 10 log pertama per kebiasaan per hari yang memberi XP
export const XP_BAD_LOG = 0;
export const LEVEL_BASE = 50;
```

## XP

| Aksi | XP |
|---|---|
| +1 kebiasaan **baik** (log ke-1 sampai ke-10 pada hari itu untuk kebiasaan tersebut) | +10 |
| +1 kebiasaan baik di atas batas harian | 0 (hitungan tetap bertambah) |
| +1 kebiasaan **buruk** | 0 |
| −1 (koreksi) kebiasaan baik yang tadinya memberi XP | −10 (XP tidak boleh < 0) |
| Bonus badge | lihat tabel badge |

Dokumen log menyimpan `xpEarned` agar pembatalan −1 akurat.

## Level

```ts
level = Math.floor(Math.sqrt(xp / LEVEL_BASE)) + 1
xpForLevel(n) = LEVEL_BASE * (n - 1) ** 2        // XP minimum untuk mencapai level n
progress = (xp - xpForLevel(level)) / (xpForLevel(level + 1) - xpForLevel(level))
```

| Level | XP minimum |
|---|---|
| 1 | 0 |
| 2 | 50 |
| 3 | 200 |
| 4 | 450 |
| 5 | 800 |
| 10 | 4050 |

### Gelar Level

| Level | Gelar |
|---|---|
| 1–2 | Pemula Santuy 🌱 |
| 3–4 | Mulai Konsisten 🌤️ |
| 5–7 | Habit Hunter 🏹 |
| 8–11 | Streak Master 🔥 |
| 12+ | Legenda Senja 🌇 |

Level naik → `levelUp: true` pada `LogResult` → confetti + `LevelUpModal`. Level tidak turun walau XP berkurang karena koreksi −1 (gunakan `max(level lama, level baru)` saat koreksi, atau cukup larang level turun pada operasi decrement).

## Streak

### Streak harian user (`dailyStreak`)
- Bertambah bila user mencatat **minimal 1 kebiasaan baik** pada suatu hari.
- Aturan saat log baik pertama pada hari itu (`lastActiveDate != today`):
  - `lastActiveDate == kemarin` → `dailyStreak + 1`
  - selain itu → `dailyStreak = 1`
  - perbarui `longestDailyStreak = max(...)` dan `lastActiveDate = today`
- Log kebiasaan buruk **tidak memutus** streak harian.
- Tampilan: jika `lastActiveDate` lebih lama dari kemarin, tampilkan 0 (lihat helper `getEffectiveStreak`).

### Streak per kebiasaan baik (`currentStreak`)
- Aturan identik, per kebiasaan memakai `lastLogDate`.

### Hari bebas per kebiasaan buruk
- `hariBebas = selisihHari(today, lastLogDate ?? startDate)`.
- Saat ada log buruk baru: hitung `gap = selisihHari(today, lastLogDate ?? startDate)`, perbarui `longestStreak = max(longestStreak, gap)`, lalu `lastLogDate = today`.
- Tampilan: "🧊 {n} hari bebas". Jika n = 0 tampilkan "Mulai lagi hari ini 🌙".

### Koreksi (−1) sampai hitungan 0
- Hapus dokumen log, hitung ulang `lastLogDate` dan `currentStreak` kebiasaan dari log terakhir yang tersisa (query riwayat), dan pulihkan `lastActiveDate`/`dailyStreak` user bila log baik terakhir hari itu yang dihapus. Fungsi murni `recomputeStreak(sortedDates, today)` menerima daftar tanggal log dan mengembalikan streak.

## Hari Sempurna

Terjadi ketika **semua kebiasaan baik aktif** memiliki `count >= 1` pada hari ini (minimal 1 kebiasaan baik aktif). Memicu confetti dan pesan "Semua kebiasaan baik hari ini beres! 🎉" **satu kali per hari** (simpan flag di state lokal/sessionStorage agar tidak berulang). Tidak memberi XP.

## Badge

| ID | Nama | Emoji | Syarat | Bonus XP |
|---|---|---|---|---|
| `first_habit` | Langkah Pertama | 🌱 | Membuat kebiasaan pertama | +10 |
| `first_log` | Gas Pertama | ⚡ | Log pertama kali (baik atau buruk) | +10 |
| `streak_3` | Api Kecil | 🔥 | `dailyStreak` ≥ 3 | +20 |
| `streak_7` | Seminggu Konsisten | 🌅 | `dailyStreak` ≥ 7 | +50 |
| `streak_30` | Sebulan Nonstop | 👑 | `dailyStreak` ≥ 30 | +200 |
| `clean_7` | Seminggu Bebas | 🧊 | Hari bebas salah satu kebiasaan buruk ≥ 7 | +50 |
| `clean_30` | Sebulan Bersih | 💎 | Hari bebas salah satu kebiasaan buruk ≥ 30 | +200 |
| `logs_100` | Seratus Catatan | 💯 | `totalGoodLogs` ≥ 100 | +100 |
| `habit_5` | Kolektor Kebiasaan | 🧺 | Memiliki ≥ 5 kebiasaan aktif | +20 |

Aturan:
- Badge hanya diberikan **sekali**; simpan `badges[id] = serverTimestamp`.
- Bonus XP hanya diberikan saat badge pertama kali dibuka dan **tidak dicabut** saat koreksi −1.
- `evaluateBadges(userState, habits)` fungsi murni → mengembalikan daftar `BadgeId` baru yang layak dibuka.
- Badge `clean_*` bertambah tanpa ada penulisan (hari berlalu). Evaluasi dengan `evaluateCleanBadges` setiap kali halaman Hari Ini memuat data kebiasaan; fungsinya idempoten.
- Badge terbuka → toast `BadgeToast` + confetti kecil.

## Mood

- Lima pilihan: 😄 happy, 😌 chill, 😔 sad, 😤 angry, 😴 tired.
- Disimpan per log (per kebiasaan per hari), bisa diganti atau dikosongkan sepanjang hari yang sama.
- Dipakai pada `MoodSummary` di dashboard dan riwayat di detail kebiasaan. Tidak memengaruhi XP.

## Pesan Motivasi

Pesan acak diambil dari `lib/copy.ts` berdasarkan konteks (`goodLog`, `badLog`, `streak`, `levelUp`, `perfectDay`, `badge`). Hindari mengulang pesan yang sama berturut-turut (simpan indeks terakhir).

## Confetti

```ts
import confetti from "canvas-confetti";
// warna dari theme.ts: primary, secondary, accent, good
// Pemicu: levelUp, badge baru, perfectDay. Lewati bila prefers-reduced-motion.
```

## Test Wajib (Vitest)

- `calcLevel` pada batas XP (49 → L1, 50 → L2, 199 → L2, 200 → L3).
- XP: log ke-10 memberi XP, log ke-11 tidak; −1 mengembalikan XP; tidak pernah < 0.
- Streak: hari berurutan, loncat hari (reset), log kedua pada hari yang sama (tidak berubah).
- Hari bebas dan rekor `longestStreak` saat log buruk.
- `recomputeStreak` dengan berbagai daftar tanggal.
- `evaluateBadges` tidak memberikan badge yang sudah dimiliki.
- Pergantian bulan/tahun dan zona waktu pada fungsi tanggal.
