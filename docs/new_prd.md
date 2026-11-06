# New Feature PRD — Kebiasaan

> **Status:** Draft · **Tanggal:** 2026-11-06  
> Dokumen ini berisi saran fitur lanjutan untuk melengkapi dan meningkatkan aplikasi Kebiasaan.

---

## Visi

Kebiasaan sudah punya fondasi yang kuat: pencatatan harian, gamifikasi, dashboard analitik, dan PWA. Langkah berikutnya adalah membuat pengguna _tetap termotivasi jangka panjang_ dan _mudah onboarding_ — tanpa memperumit antarmuka.

---

## Fitur Prioritas Tinggi

### 1. Target Harian per Kebiasaan

**Deskripsi:** Saat ini counter hanya naik/turun tanpa target. Tambahkan field `dailyTarget` (opsional, default 1) di schema habit, lalu tampilkan progress bar mini di HabitCard.

**User story:**  
_Sebagai pengguna yang ingin minum 8 gelas air sehari, saya ingin bisa set target 8 agar tahu sudah seberapa jauh saya hari ini._

**Spesifikasi teknis:**
- Tambah `dailyTarget?: number` di `HabitDoc` (default `1`)
- Form tambah/edit kebiasaan: input angka opsional di bawah nama
- `HabitCard`: tampilkan `progress / dailyTarget` sebagai progress bar tipis (Flowbite `Progress`)
- Log dianggap "selesai" jika `count >= dailyTarget` (untuk perhitungan streak & XP)
- Tidak perlu migrasi — habit lama dengan `dailyTarget = undefined` dianggap `1`

**Kompleksitas:** Sedang (3–4 hari)  
**Prioritas:** 🔴 Tinggi

---

### 2. Pengingat Harian (Web Push Notifications)

**Deskripsi:** Pengguna bisa set jam pengingat harian. Notifikasi dikirim via Web Push + Firebase Cloud Messaging (FCM) agar berjalan walau browser tertutup.

**User story:**  
_Sebagai pengguna yang sering lupa mencatat, saya ingin dapat notifikasi jam 20:00 setiap hari sebagai pengingat._

**Spesifikasi teknis:**
- Minta izin notifikasi saat onboarding pertama (atau di halaman Profil)
- Simpan FCM token + jam pengingat di `UserDoc`
- Firebase Cloud Function (Node.js) terjadwal setiap menit, kirim push ke user yang jam pengingatnya cocok
- SW: handle `push` event, tampilkan notifikasi native
- UI: toggle + time picker di halaman Profil

**Kompleksitas:** Tinggi (1–2 minggu, butuh Cloud Functions)  
**Prioritas:** 🔴 Tinggi

---

### 3. Catatan Bebas per Log Harian

**Deskripsi:** Perluas mood picker agar pengguna bisa tambah catatan teks singkat per hari per kebiasaan (jurnal micro).

**User story:**  
_Setelah mencatat mood, saya ingin bisa tulis 1–2 kalimat tentang apa yang terjadi hari ini._

**Spesifikasi teknis:**
- Tambah `note?: string` di `LogDoc`
- Modal mood picker: tambah `<Textarea>` opsional di bawah emoji mood (max 280 karakter)
- Halaman detail kebiasaan: tampilkan catatan di tooltip/popover saat tap titik chart

**Kompleksitas:** Rendah (1–2 hari)  
**Prioritas:** 🔴 Tinggi

---

### 4. Habit Templates (Onboarding)

**Deskripsi:** Tampilkan daftar kebiasaan populer saat state kosong di halaman "Hari Ini", sehingga pengguna baru bisa mulai dalam 2 tap.

**User story:**  
_Sebagai pengguna baru, saya ingin langsung dapat inspirasi kebiasaan tanpa harus berpikir dari nol._

**Spesifikasi teknis:**
- Array statis `HABIT_TEMPLATES` di `src/lib/copy.ts` (10–15 template: nama, tipe, ikon)
- Empty state di `kebiasaan/page.tsx`: tampilkan card template dalam grid 2 kolom
- Tap template → pre-fill form tambah kebiasaan → user langsung simpan
- Tidak perlu backend tambahan

**Kompleksitas:** Rendah (1 hari)  
**Prioritas:** 🔴 Tinggi

---

### 5. Kartu Insight Mingguan

**Deskripsi:** Card di dashboard yang menulis ringkasan minggu ini vs minggu lalu dalam satu kalimat natural language (tanpa AI, cukup template string).

**User story:**  
_Saya ingin tahu dalam 5 detik apakah minggu ini lebih baik dari minggu lalu._

**Spesifikasi teknis:**
- Fungsi `generateWeeklyInsight(thisWeek, lastWeek): string` di `src/lib/stats.ts`
- Output: "Minggu ini kamu mencatat 42 kali — naik 15% dari minggu lalu 🎉" atau variasi negatif/netral
- Tampilkan sebagai Flowbite `Alert` warna hijau/kuning/merah di atas dashboard

**Kompleksitas:** Rendah (1 hari)  
**Prioritas:** 🔴 Tinggi

---

## Fitur Prioritas Sedang

### 6. Halaman Weekly Review

**Deskripsi:** Halaman `/review` khusus yang muncul otomatis Senin pagi, menampilkan ringkasan 7 hari kemarin + prompt refleksi.

**User story:**  
_Setiap Senin, saya ingin lihat recap mingguku dan menjawab satu pertanyaan refleksi._

**Spesifikasi teknis:**
- Route `src/app/(app)/review/page.tsx`
- Data dari `useLogsRange` (7 hari kemarin)
- Tampilkan: total log, habit terbaik, mood dominan, badge baru
- 1 pertanyaan refleksi acak dari array statis (tanpa AI)
- Jawaban disimpan opsional di `UserDoc.weeklyReflections[]`
- Redirect otomatis dari `/hari-ini` jika hari Senin dan belum mengisi review minggu ini

**Kompleksitas:** Sedang (3–4 hari)  
**Prioritas:** 🟡 Sedang

---

### 7. Export Data (CSV)

**Deskripsi:** Tombol "Unduh Data" di halaman Profil yang menghasilkan file CSV semua log kebiasaan.

**User story:**  
_Saya ingin punya backup data saya sendiri dan bisa analisis di Excel._

**Spesifikasi teknis:**
- Query semua `logs` user dari Firestore (satu kali, bukan realtime)
- Generate CSV di client-side (tidak perlu server): `Blob` + `URL.createObjectURL`
- Kolom: `tanggal, kebiasaan, tipe, jumlah, mood, catatan`
- Tombol di `src/app/(app)/profil/page.tsx`
- Library: tidak perlu library eksternal, manual CSV string sudah cukup

**Kompleksitas:** Rendah (1 hari)  
**Prioritas:** 🟡 Sedang

---

### 8. Berbagi Pencapaian

**Deskripsi:** Buat gambar kartu pencapaian (streak milestone, badge baru) yang bisa dibagikan ke media sosial.

**User story:**  
_Setelah dapat badge "Konsisten 30 Hari", saya ingin share ke Instagram stories._

**Spesifikasi teknis:**
- Library: `html-to-image` (ringan, tidak perlu Canvas API manual)
- Komponen `AchievementCard` yang dirender off-screen, lalu di-capture sebagai PNG
- Trigger: tombol "Bagikan" muncul di modal badge baru + di halaman Profil per badge
- Konten kartu: nama badge, ikon, nama pengguna, nama app + branding minimal

**Kompleksitas:** Sedang (2–3 hari)  
**Prioritas:** 🟡 Sedang

---

### 9. Tag / Kategori Habit

**Deskripsi:** Tambahkan tag opsional per kebiasaan (selain tipe baik/buruk) untuk pengelompokan lebih fleksibel.

**User story:**  
_Saya ingin bisa filter kebiasaan berdasarkan kategori "Kesehatan" atau "Produktivitas"._

**Spesifikasi teknis:**
- `tags?: string[]` di `HabitDoc`
- Preset tag: Kesehatan, Produktivitas, Keuangan, Sosial, Mental, Lainnya
- Multi-select chips di form habit
- Filter chip di halaman kebiasaan (`/kebiasaan`) untuk filter per tag
- Dashboard: breakdown donut per tag (ganti/tambah tab dari tipe ke tag)

**Kompleksitas:** Sedang (3–4 hari)  
**Prioritas:** 🟡 Sedang

---

### 10. Grace Day (Hari Ampunan)

**Deskripsi:** Izinkan satu hari absen tanpa memutus streak, sekali per 7 hari.

**User story:**  
_Saya sakit satu hari dan tidak mau streak 30 hari saya hilang karena itu._

**Spesifikasi teknis:**
- Tambah `graceDayUsedAt?: string` (tanggal ISO) di `HabitDoc`
- Logic di `incrementLog`: jika hari gap = 2 dan `graceDayUsedAt` belum dipakai minggu ini → streak tetap, `graceDayUsedAt = yesterday`
- Indikator visual di HabitCard: ikon 🛡️ kecil jika grace day terpakai minggu ini
- Hitung reset grace day: setiap Senin `graceDayUsedAt` di-clear

**Kompleksitas:** Sedang (2–3 hari)  
**Prioritas:** 🟡 Sedang

---

## Fitur Prioritas Rendah (Nice-to-Have)

### 11. Urutkan & Pin Kebiasaan

**Deskripsi:** Drag-to-reorder dan pin kebiasaan favorit ke atas daftar.

**Spesifikasi teknis:**
- `order?: number` + `pinned?: boolean` di `HabitDoc`
- Library drag: `@dnd-kit/sortable` (ringan, accessible)
- Simpan urutan ke Firestore saat drop selesai (batch update)

**Kompleksitas:** Sedang  
**Prioritas:** 🟢 Rendah

---

### 12. Warna Aksen per Kebiasaan

**Deskripsi:** Pilih warna aksen dari palet terbatas (6 warna desain sistem) untuk tiap kebiasaan.

**Spesifikasi teknis:**
- `color?: 'rose' | 'amber' | 'emerald' | 'sky' | 'violet' | 'orange'` di `HabitDoc`
- Color picker sebagai 6 dot di form habit
- HabitCard: gunakan warna untuk border-left dan ikon tipe

**Kompleksitas:** Rendah  
**Prioritas:** 🟢 Rendah

---

### 13. Accountability Buddy (Read-Only Share)

**Deskripsi:** Buat link publik read-only profil statistik untuk dibagikan ke teman/mentor.

**Spesifikasi teknis:**
- Generate `shareToken` unik di `UserDoc`
- Route publik `src/app/u/[token]/page.tsx` (tidak butuh auth)
- Tampilkan: nama, level, badge, streak terbaik — tanpa data detail log
- Toggle aktif/nonaktif di halaman Profil

**Kompleksitas:** Sedang  
**Prioritas:** 🟢 Rendah

---

### 14. Insight AI (Gemini API)

**Deskripsi:** Kirim ringkasan log 7 hari ke Gemini API, terima analisis pola dan saran singkat dalam bahasa Indonesia.

**Spesifikasi teknis:**
- Firebase Extension atau Cloud Function proxy ke Gemini API (agar API key tidak di client)
- Trigger manual: tombol "Minta Insight" di dashboard
- Output: 2–3 paragraf analisis + 1–2 saran konkret
- Cache hasil per minggu di `UserDoc.lastInsight`

**Kompleksitas:** Tinggi (butuh Cloud Functions + billing)  
**Prioritas:** 🟢 Rendah

---

## Ringkasan Prioritas

| # | Fitur | Prioritas | Kompleksitas |
|---|-------|-----------|--------------|
| 1 | Target Harian | 🔴 Tinggi | Sedang |
| 2 | Pengingat Harian | 🔴 Tinggi | Tinggi |
| 3 | Catatan per Log | 🔴 Tinggi | Rendah |
| 4 | Habit Templates | 🔴 Tinggi | Rendah |
| 5 | Insight Mingguan | 🔴 Tinggi | Rendah |
| 6 | Weekly Review | 🟡 Sedang | Sedang |
| 7 | Export CSV | 🟡 Sedang | Rendah |
| 8 | Berbagi Pencapaian | 🟡 Sedang | Sedang |
| 9 | Tag Kategori | 🟡 Sedang | Sedang |
| 10 | Grace Day | 🟡 Sedang | Sedang |
| 11 | Urutkan & Pin | 🟢 Rendah | Sedang |
| 12 | Warna Aksen | 🟢 Rendah | Rendah |
| 13 | Accountability Buddy | 🟢 Rendah | Sedang |
| 14 | Insight AI | 🟢 Rendah | Tinggi |

---

## Urutan Implementasi yang Disarankan

Jika ingin mulai, urutan terbaik berdasarkan impact/effort:

1. **Habit Templates** → langsung tangani masalah onboarding, mudah
2. **Catatan per Log** → extend fitur mood yang sudah ada, 1–2 hari
3. **Kartu Insight Mingguan** → tingkatkan nilai dashboard, 1 hari
4. **Target Harian** → fitur inti yang paling banyak diminta pengguna habit tracker
5. **Export CSV** → kepercayaan pengguna (data ownership)
6. **Weekly Review** → retensi jangka panjang
7. **Pengingat Harian** → engagement harian, butuh FCM setup

---

_Dokumen ini bersifat saran — tidak semua harus diimplementasi. Pilih berdasarkan feedback pengguna nyata._
