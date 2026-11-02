# PRD — Kebiasaan

## 1. Tujuan

Membantu anak muda mencatat dan memahami kebiasaan sehari-harinya, baik yang ingin dipertahankan (kebiasaan baik) maupun yang ingin dikurangi (kebiasaan buruk), dengan pengalaman yang ringan, lucu, dan memotivasi, bukan menghakimi.

## 2. Target Pengguna

Pelajar, mahasiswa, dan pekerja muda (Gen Z) yang mengakses lewat HP dan kadang laptop. Mereka suka UI estetik, interaksi cepat, dan elemen game.

## 3. Konsep Singkat

- **Dua langkah:** (1) catat dulu kebiasaannya, (2) setiap kali dilakukan, tekan tombol untuk menambah hitungan hari itu.
- Hitungan disimpan **per hari per kebiasaan**, sehingga rekap mingguan dan bulanan mudah dihitung.
- Dashboard merekap harian, mingguan, bulanan.

## 4. Istilah

| Istilah | Arti |
|---|---|
| Kebiasaan | Entitas yang dicatat user (mis. "Minum air", "Scroll TikTok") |
| Kategori | `good` (kebiasaan baik) atau `bad` (kebiasaan buruk) |
| Log | Hitungan satu kebiasaan pada satu tanggal |
| Hari bebas | Jumlah hari berturut-turut tanpa melakukan kebiasaan buruk |
| Streak | Hari berturut-turut melakukan kebiasaan baik |

## 5. Fitur (Scope v1)

### F1. Autentikasi
- Daftar dengan nama, email, password.
- Masuk, keluar, dan lupa password (email reset dari Firebase).
- **Kriteria:** user yang belum masuk tidak bisa membuka halaman aplikasi; pesan error berbahasa Indonesia.

### F2. Kelola Kebiasaan
- Buat kebiasaan: **nama**, **kategori** (baik/buruk), **tanggal mulai**, **catatan** (opsional), **emoji** (opsional).
- Ubah, arsipkan, dan hapus kebiasaan. Hapus kebiasaan ikut menghapus seluruh log-nya (dengan konfirmasi).
- Daftar kebiasaan dengan filter Semua / Baik / Buruk.
- **Kriteria:** nama 1–60 karakter, catatan maks 200 karakter, tanggal mulai tidak boleh di masa depan.

### F3. Catat Harian ("Hari Ini")
- Menampilkan semua kebiasaan aktif beserta hitungan hari ini.
- Tombol **+1** menambah hitungan; tombol **−1** mengoreksi salah tekan (hanya hari ini, minimal 0).
- Opsional pilih **mood** per kebiasaan hari itu.
- Kebiasaan buruk menampilkan "hari bebas"; kebiasaan baik menampilkan streak.
- **Kriteria:** hitungan bertambah instan (optimistic UI), tetap bisa dipakai offline dan tersinkron saat online.
- Pencatatan hanya untuk **hari ini** (tidak ada backdate di v1).

### F4. Dashboard Rekap
- Pemilih periode: **Harian**, **Mingguan**, **Bulanan**.
  - Harian = 7 hari terakhir per hari; Mingguan = 8 minggu terakhir per minggu; Bulanan = 6 bulan terakhir per bulan.
- Kartu ringkasan periode berjalan (hari ini / minggu ini / bulan ini) dengan selisih terhadap periode sebelumnya: total baik, total buruk, skor keseimbangan, streak.
- Grafik batang/garis **baik vs buruk** per periode.
- Donat porsi kebiasaan baik vs buruk.
- **Heatmap kalender** (20 minggu terakhir) dengan toggle Baik/Buruk.
- **Top kebiasaan** baik dan buruk pada periode terpilih.
- Distribusi **mood** pada periode terpilih.
- Kartu level/XP.
- Minggu dimulai hari **Senin**.

### F5. Detail Kebiasaan
- Statistik kebiasaan (total, streak/hari bebas, rata-rata per hari aktif), grafik 30 hari, riwayat log, tombol ubah/arsip/hapus.

### F6. Gamifikasi
- Streak, XP, level, badge, confetti, dan pesan motivasi. Aturan lengkap di `GAMIFICATION.md`.

### F7. Profil
- Ubah nama tampilan, lihat level/XP, daftar badge (terkunci/terbuka), keluar.

### F8. PWA
- Bisa dipasang ke layar utama, tampil standalone, punya halaman offline, dan pencatatan tetap bekerja offline. Detail di `PWA.md`.

## 6. Di Luar Scope (v1)

Login Google/sosial, fitur sosial (teman, leaderboard), notifikasi push dan pengingat, backdate log, ekspor data, multi-bahasa, tema terang, aplikasi native, halaman landing marketing.

## 7. Persyaratan Non-Fungsional

- Responsif 360px sampai desktop; mobile-first.
- Lighthouse PWA terpenuhi (installable) dan Performance mobile ≥ 80 sebagai target.
- Data tiap user terisolasi lewat Firestore Security Rules.
- Seluruh teks UI Bahasa Indonesia.
- Kontras teks memenuhi WCAG AA pada token warna yang ditetapkan.

## 8. Asumsi yang Diambil

- Zona waktu default `Asia/Jakarta`, disimpan di profil user.
- Tanpa verifikasi email di v1 (bisa ditambah nanti).
- XP dan streak dihitung di sisi klien (lihat catatan keamanan di DATABASE_SCHEMA). Cukup untuk aplikasi pribadi/non-kompetitif.
- Kebiasaan buruk tidak mengurangi XP (pendekatan suportif).
