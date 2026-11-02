# DATABASE_SCHEMA — Kebiasaan (Firestore)

## Prinsip

- Semua data milik user berada di bawah `users/{uid}`. Tidak ada koleksi global.
- **Log disimpan per hari per kebiasaan** (satu dokumen = satu kebiasaan pada satu tanggal) dengan field `count`. Setiap kali kebiasaan dilakukan, `count` bertambah 1. Pola ini membuat rekap harian, mingguan, dan bulanan cukup dengan query rentang tanggal atau `weekKey` / `monthKey`.
- Tanggal disimpan sebagai **string `YYYY-MM-DD`** (zona waktu user), bukan Timestamp, agar pengelompokan per hari tidak bergeser karena UTC.
- Kategori di-*denormalisasi* ke dokumen log supaya dashboard bisa menghitung baik vs buruk tanpa join.

## Struktur

```
users/{uid}
  ├─ habits/{habitId}
  └─ logs/{date}_{habitId}        // contoh: 2026-11-02_abc123
```

## Tipe TypeScript (`src/types`)

```ts
export type HabitCategory = "good" | "bad";
export type Mood = "happy" | "chill" | "sad" | "angry" | "tired";
// emoji: happy 😄, chill 😌, sad 😔, angry 😤, tired 😴

export type BadgeId =
  | "first_habit" | "first_log"
  | "streak_3" | "streak_7" | "streak_30"
  | "clean_7" | "clean_30"
  | "logs_100" | "habit_5";

export interface UserDoc {
  displayName: string;
  email: string;
  timezone: string;              // default "Asia/Jakarta"
  xp: number;                    // >= 0
  level: number;                 // turunan dari xp, disimpan untuk kemudahan baca
  dailyStreak: number;           // hari berturut-turut dengan >= 1 log kebiasaan baik
  longestDailyStreak: number;
  lastActiveDate: string | null; // YYYY-MM-DD, terakhir ada log kebiasaan baik
  totalGoodLogs: number;
  totalBadLogs: number;
  badges: Partial<Record<BadgeId, Timestamp>>; // badge terbuka + waktunya
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HabitDoc {
  name: string;                  // 1–60 karakter
  category: HabitCategory;
  emoji: string;                 // default "🌱" (good) / "🍟" (bad)
  note: string;                  // 0–200 karakter
  startDate: string;             // YYYY-MM-DD, tidak boleh di masa depan
  isArchived: boolean;
  totalCount: number;            // akumulasi seluruh log
  currentStreak: number;         // dipakai kategori "good"
  longestStreak: number;         // good: streak terpanjang; bad: hari bebas terpanjang
  lastLogDate: string | null;    // YYYY-MM-DD log terakhir (null jika belum pernah)
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LogDoc {
  habitId: string;
  category: HabitCategory;       // denormalisasi dari habit
  date: string;                  // YYYY-MM-DD
  weekKey: string;               // ISO week, contoh "2026-W45" (minggu mulai Senin)
  monthKey: string;              // contoh "2026-11"
  count: number;                 // >= 1 (dokumen dihapus bila kembali ke 0)
  mood: Mood | null;             // mood terakhir yang dipilih pada hari itu
  xpEarned: number;              // XP yang diberikan dari log ini (untuk pembatalan -1)
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Catatan perilaku:
- **Hari bebas** kebiasaan buruk tidak disimpan; dihitung saat dibaca: `selisihHari(today, lastLogDate ?? startDate)`. Yang disimpan hanya `longestStreak` (rekor hari bebas), diperbarui saat ada log baru.
- **Streak kebiasaan baik** yang ditampilkan harus lewat helper `getEffectiveStreak(habit, today)`: jika `lastLogDate` lebih lama dari kemarin, tampilkan 0.
- Mengurangi hitungan sampai 0 → hapus dokumen log, lalu hitung ulang streak kebiasaan itu dari log terakhir (query `habitId == x`, urut `date` desc, batas 365).
- `weekKey` dan `monthKey` dihitung oleh `lib/date.ts`, tidak boleh dihitung manual di tempat lain.

## Query yang Dipakai

| Kebutuhan | Query |
|---|---|
| Daftar kebiasaan | `habits` urut `createdAt` desc, filter arsip di klien |
| Log hari ini | `logs` where `date == today` |
| Log rentang (dashboard, heatmap) | `logs` where `date >= start` and `date <= end`, urut `date` |
| Riwayat satu kebiasaan | `logs` where `habitId == id`, urut `date` desc, limit 60 |
| Hapus semua log kebiasaan | `logs` where `habitId == id` (batch maks 500 per commit) |

Heatmap memakai 20 minggu (140 hari) terakhir; dashboard bulanan memakai 6 bulan terakhir (sekitar 180 hari). Ukuran data per user tetap kecil.

## Index (`firestore.indexes.json`)

Query rentang pada satu field (`date`) memakai index otomatis. Hanya satu index komposit yang dibutuhkan:

```json
{
  "indexes": [
    {
      "collectionGroup": "logs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "habitId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

## Security Rules (`firestore.rules`)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isOwner(uid) {
      return request.auth != null && request.auth.uid == uid;
    }
    function validCategory(c) {
      return c in ['good', 'bad'];
    }

    match /users/{uid} {
      allow read, create, update: if isOwner(uid);
      allow delete: if false;

      match /habits/{habitId} {
        allow read, delete: if isOwner(uid);
        allow create, update: if isOwner(uid)
          && request.resource.data.name is string
          && request.resource.data.name.size() >= 1
          && request.resource.data.name.size() <= 60
          && validCategory(request.resource.data.category)
          && request.resource.data.note is string
          && request.resource.data.note.size() <= 200;
      }

      match /logs/{logId} {
        allow read, delete: if isOwner(uid);
        allow create, update: if isOwner(uid)
          && request.resource.data.count is int
          && request.resource.data.count >= 1
          && request.resource.data.count <= 999
          && validCategory(request.resource.data.category)
          && request.resource.data.date is string
          && request.resource.data.date.size() == 10;
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Catatan keamanan

- Rules memastikan **data antar user terisolasi** dan bentuk dokumen valid.
- XP, level, dan streak dihitung di klien, sehingga user yang teknis bisa mengubah angkanya sendiri. Untuk aplikasi pribadi tanpa leaderboard ini bisa diterima. Jika nanti ada fitur kompetitif, pindahkan perhitungan ke Cloud Functions.
- Hapus akun tidak ada di v1.

## Pembuatan Dokumen User

Saat register sukses, `ensureUserDoc` membuat `users/{uid}` dengan nilai awal: `xp: 0`, `level: 1`, `dailyStreak: 0`, `longestDailyStreak: 0`, `lastActiveDate: null`, `totalGoodLogs: 0`, `totalBadLogs: 0`, `badges: {}`, `timezone: "Asia/Jakarta"`. Fungsi ini idempoten dan juga dipanggil saat login bila dokumen belum ada.
