# USER_FLOW — Kebiasaan

## Alur Utama

```
Buka app
  ├─ belum login ─► /masuk ─► (belum punya akun) /daftar ─► berhasil ─┐
  │                  └─► /lupa-password                                │
  └─ sudah login ─────────────────────────────────────────────────────┤
                                                                       ▼
                                                        /hari-ini (halaman utama)
                                                          ├─ belum ada kebiasaan ─► empty state ─► Modal "Tambah kebiasaan"
                                                          ├─ tekan + pada kebiasaan ─► hitungan hari ini +1 ─► (XP, streak, confetti)
                                                          ├─ pilih mood (opsional)
                                                          └─ nav: Kebiasaan · Dashboard · Profil
```

Alur inti sesuai kebutuhan user: **(1) catat kebiasaan dulu → (2) setiap kali dilakukan, tekan + untuk menambah hitungan hari itu.**

## Spesifikasi per Halaman

### `/masuk`
- Field: email, password (tombol tampil/sembunyi). Tombol "Masuk". Tautan "Lupa password?" dan "Belum punya akun? Daftar".
- Validasi: email valid, password wajib. Tombol disabled + spinner saat proses.
- Sukses → `/hari-ini`. Gagal → pesan di bawah form (lihat tabel error).

### `/daftar`
- Field: nama tampilan (2–30 karakter), email, password (min 8 karakter), konfirmasi password.
- Sukses → buat `users/{uid}` → `/hari-ini` dengan toast "Selamat datang, {nama}! 🎉".

### `/lupa-password`
- Field email → kirim email reset. Selalu tampilkan pesan netral: "Kalau emailnya terdaftar, link reset sudah dikirim 📬".

### `/hari-ini` (halaman utama)
- Header: sapaan + tanggal hari ini (format Indonesia, mis. "Senin, 2 November"), `StreakBadge` harian, chip level/XP.
- Ringkasan kecil: "Baik hari ini: N · Buruk hari ini: M".
- Dua bagian: **Kebiasaan Baik** dan **Kebiasaan Buruk** (bagian kosong disembunyikan).
- Setiap kebiasaan = Kartu Kebiasaan (lihat DESIGN_SYSTEM).
  - **+**: tambah hitungan; **−**: koreksi (nonaktif saat 0).
  - Setelah hitungan > 0, muncul `MoodPicker` (5 emoji), memilih lagi mengganti, tekan emoji yang sama menghapus.
- Tombol melayang **"+ Kebiasaan"** membuka modal tambah.
- Empty state bila belum ada kebiasaan aktif.
- Efek setelah +1 pada kebiasaan baik: pop angka, pesan motivasi (toast singkat); confetti bila level up, badge baru, atau hari sempurna.
- Efek setelah +1 pada kebiasaan buruk: tanpa confetti, pesan suportif, hari bebas direset ke 0.
- Banner offline muncul bila tidak ada koneksi.

### Modal Tambah / Ubah Kebiasaan
- Field: **Nama** (wajib), **Kategori** (dua pilihan besar bergaya kartu: "Kebiasaan Baik 🌱" / "Kebiasaan Buruk 🍟"), **Tanggal mulai** (default hari ini, tidak boleh di masa depan), **Catatan** (opsional), **Emoji** (pilihan cepat ±24 emoji, default sesuai kategori).
- Tombol "Simpan" dan "Batal". Mode ubah: kategori boleh diubah, dan perubahan tidak mengubah log lama (kategori log lama tetap, kecuali dilakukan migrasi eksplisit; di v1 **kategori tidak bisa diubah setelah dibuat** untuk menjaga rekap tetap konsisten. Tampilkan kategori sebagai teks saja).
- Validasi ditampilkan inline di bawah field.

### `/kebiasaan`
- Filter: Semua / Baik / Buruk. Pencarian nama (opsional, sisi klien).
- Daftar kartu: emoji, nama, kategori, total hitungan, streak/hari bebas, status arsip.
- Aksi per kebiasaan: buka detail, ubah, arsipkan/aktifkan, hapus.
- Tab/toggle "Diarsipkan" untuk melihat kebiasaan yang diarsipkan.

### `/kebiasaan/[id]`
- Header: emoji, nama, chip kategori, catatan.
- Statistik: total hitungan, streak saat ini / hari bebas, rekor, rata-rata per hari aktif.
- Grafik batang 30 hari terakhir (satu seri warna sesuai kategori).
- Riwayat: daftar tanggal + hitungan + mood (60 terakhir).
- Aksi: Ubah, Arsipkan, Hapus (modal konfirmasi: "Semua catatan kebiasaan ini ikut terhapus dan nggak bisa dikembalikan.").
- ID tidak ditemukan → tampilan "Kebiasaan tidak ketemu" dengan tombol kembali.

### `/dashboard`
Urutan komponen dari atas:
1. `PeriodTabs`: **Harian · Mingguan · Bulanan** (default Harian).
2. `SummaryCards` (4 kartu): Total Baik, Total Buruk, Skor Keseimbangan (`baik / (baik + buruk)` dalam %), Streak Harian. Tiap kartu menampilkan selisih vs periode sebelumnya (▲/▼ dan persen).
3. `TrendChart`: batang berkelompok baik vs buruk.
   - Harian: 7 hari terakhir. Mingguan: 8 minggu terakhir. Bulanan: 6 bulan terakhir.
4. `ShareDonut`: porsi baik vs buruk pada periode berjalan.
5. `CalendarHeatmap`: 20 minggu terakhir, toggle Baik/Buruk, tooltip "N kali pada {tanggal}".
6. `TopHabits`: 5 kebiasaan baik teratas dan 5 kebiasaan buruk teratas pada periode berjalan.
7. `MoodSummary`: distribusi mood pada periode berjalan.
8. `LevelCard`: level, XP, progres.

Periode berjalan: Harian = hari ini, Mingguan = minggu ini (Senin–Minggu), Bulanan = bulan ini. Perbandingan selalu dengan periode sebelumnya yang setara.

Edge case: belum ada data → empty state "Belum ada catatan. Mulai dari Hari Ini ya 🌱" dengan tombol ke `/hari-ini`.

### `/profil`
- Avatar inisial berwarna, nama tampilan (bisa diubah), email (read-only).
- Kartu level besar + `XpBar`.
- `BadgeGrid`: semua badge, yang terkunci tampil abu-abu dengan petunjuk cara membukanya.
- Tombol "Keluar" (konfirmasi singkat).

### `/offline`
- Emoji 📴 + "Kamu lagi offline" + tombol "Coba lagi". Hanya muncul saat halaman belum ter-cache.

## Pesan Error Auth (`mapAuthError`)

| Kode Firebase | Pesan |
|---|---|
| `auth/invalid-credential`, `auth/wrong-password`, `auth/user-not-found` | "Email atau password salah." |
| `auth/email-already-in-use` | "Email ini sudah terdaftar. Coba masuk aja." |
| `auth/weak-password` | "Password terlalu lemah, minimal 8 karakter ya." |
| `auth/invalid-email` | "Format email belum benar." |
| `auth/too-many-requests` | "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi." |
| `auth/network-request-failed` | "Koneksi bermasalah. Cek internetmu dulu." |
| lainnya | "Waduh, ada yang error. Coba lagi ya 🙏" |

## Aturan Perilaku Penting

- Pencatatan hanya untuk **tanggal hari ini** menurut zona waktu user. Pergantian hari terjadi pukul 00:00 zona waktu tersebut; hook `useToday` harus memperbarui `today` otomatis (timer menuju tengah malam dan saat tab kembali aktif).
- Hitungan maksimal 999 per kebiasaan per hari.
- Arsip: kebiasaan terarsip tidak tampil di Hari Ini, tetapi log lamanya tetap dihitung di dashboard.
- Hapus: menghapus kebiasaan dan seluruh lognya. Total XP/badge yang sudah didapat **tidak** dicabut.
