# DESIGN_SYSTEM — Kebiasaan

**Konsep:** Gen Z · **Sunset Lo-fi** (hangat, chill) · **Soft & bubbly** · satu tema gelap hangat.

Rasanya seperti senja santai sambil dengerin lo-fi: latar cokelat gelap hangat, aksen oranye-mawar-kuning, bentuk serba membulat, emoji besar, animasi memantul lembut.

## 1. Warna

### Palette inti (dari pilihan user)

| Token | Hex | Pakai untuk |
|---|---|---|
| `primary` | `#FB923C` | Tombol utama, tab aktif, fokus, progress |
| `secondary` | `#F43F5E` | Aksen kedua, gradien, tombol sekunder |
| `accent` | `#FACC15` | XP, bintang, sorotan, badge |
| `bg` | `#1C1917` | Latar halaman |
| `surface` | `#292524` | Kartu, modal, sidebar |
| `fg` | `#FAFAF9` | Teks utama |
| `good` | `#34D399` | Kebiasaan baik |
| `bad` | `#F87171` | Kebiasaan buruk |

### Token turunan (tambahan untuk konsistensi)

| Token | Nilai | Pakai untuk |
|---|---|---|
| `surface-raised` | `#342F2C` | Kartu di atas kartu, input, hover |
| `border` | `#44403C` | Garis tipis, pembatas |
| `muted` | `#A8A29E` | Teks sekunder, placeholder |
| `primary-hover` | `#F97316` | Hover/pressed tombol utama |
| `primary-soft` | `rgba(251,146,60,0.14)` | Latar chip/tab aktif |
| `good-soft` | `rgba(52,211,153,0.14)` | Latar chip kebiasaan baik |
| `bad-soft` | `rgba(248,113,113,0.14)` | Latar chip kebiasaan buruk |
| `on-primary` | `#1C1917` | Teks di atas tombol berwarna (kontras lebih baik daripada putih) |

### Aturan penggunaan warna

- **Baik = hijau mint (`good`), Buruk = koral (`bad`)** di seluruh aplikasi: chip, grafik, heatmap, angka, border kartu. Jangan dibalik atau dicampur.
- Primary dan secondary adalah warna **brand**, bukan makna. Jangan memakainya untuk menandai baik/buruk.
- Tombol berwarna memakai teks `on-primary` (gelap). Periksa kontras AA setiap menambah kombinasi baru.
- Gradien senja (hero, kartu level, splash): `linear-gradient(135deg, primary, secondary 60%, accent)`.
- Heatmap: 5 level intensitas dari `surface-raised` (kosong) lalu warna `good` atau `bad` dengan alpha 0.25, 0.45, 0.70, 1.0.

### Implementasi token (`globals.css`)

```css
@import "tailwindcss";
/* plugin & source Flowbite React: gunakan hasil `npx flowbite-react@latest init` */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary: #FB923C;
  --color-primary-hover: #F97316;
  --color-secondary: #F43F5E;
  --color-accent: #FACC15;
  --color-bg: #1C1917;
  --color-surface: #292524;
  --color-surface-raised: #342F2C;
  --color-border: #44403C;
  --color-fg: #FAFAF9;
  --color-muted: #A8A29E;
  --color-on-primary: #1C1917;
  --color-good: #34D399;
  --color-bad: #F87171;

  --font-display: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;

  --radius-bubble: 1.5rem;       /* kartu, modal */
  --radius-field: 1rem;          /* input */
  --shadow-soft: 0 8px 24px -12px rgb(0 0 0 / 0.6);
  --shadow-glow: 0 10px 30px -12px rgb(251 146 60 / 0.45);
}

html { background: var(--color-bg); color: var(--color-fg); }
body { font-family: var(--font-sans); }
h1, h2, h3, .font-display { font-family: var(--font-display); }
```

Gunakan di komponen sebagai `bg-surface`, `text-muted`, `border-border`, `text-good`, `bg-primary text-on-primary`, dan seterusnya. `src/lib/theme.ts` mengekspor hex yang sama untuk konfigurasi ApexCharts.

## 2. Tipografi

| Peran | Font | Ukuran/berat |
|---|---|---|
| Judul halaman | Outfit | 28–32px / 700 |
| Judul kartu | Outfit | 18–20px / 600 |
| Angka besar (hitungan, statistik) | Outfit | 36–56px / 700, `tabular-nums` |
| Teks isi | Plus Jakarta Sans | 14–16px / 400–500 |
| Label, caption | Plus Jakarta Sans | 12–13px / 500, warna `muted` |

## 3. Bentuk & Ruang (bubbly)

- **Radius:** kartu `rounded-3xl`, modal `rounded-3xl`, tombol dan chip `rounded-full`, input `rounded-2xl`, avatar dan ikon bulat penuh. Tidak ada sudut tajam.
- **Padding kartu:** `p-5` (mobile) / `p-6` (desktop). Jarak antar kartu `gap-4`.
- **Border:** 1px `border-border`, tanpa border tebal.
- **Bayangan:** lembut dan hangat. Kartu `shadow-soft`; elemen utama/aktif `shadow-glow` (cahaya oranye).
- **Emoji besar** (32–48px) sebagai ilustrasi di kartu kebiasaan, empty state, dan badge. Hindari ilustrasi eksternal.
- **Blob dekoratif:** 2–3 lingkaran blur besar (`primary`, `secondary`, `accent` pada opacity 10–15%) di latar halaman auth dan header dashboard (`BlobBackground`). Jangan mengganggu keterbacaan.
- **Layout:** mobile single column; `md` ke atas sidebar kiri melayang (`rounded-3xl`, margin) dan konten maks `max-w-6xl`. Navigasi mobile berupa **bottom nav melayang** berbentuk pil di bawah layar (blur latar, aman terhadap safe-area iOS).

## 4. Pemetaan Komponen Flowbite

| Kebutuhan | Komponen |
|---|---|
| Tombol | `Button` (pill; varian utama `primary`, sekunder outline) |
| Kartu | `Card` (di-tema jadi `rounded-3xl`, `bg-surface`) |
| Form | `TextInput`, `Textarea`, `Select`, `Label`, `HelperText`, `Datepicker` |
| Modal tambah/ubah kebiasaan | `Modal` (di mobile tampil seperti bottom sheet: menempel ke bawah, sudut atas membulat) |
| Konfirmasi hapus | `Modal` ukuran kecil |
| Periode dashboard | `ButtonGroup` atau `Tabs` gaya pill |
| Filter kategori | `Tabs` / `ButtonGroup` |
| Badge/chip | `Badge` (pill) |
| Progress XP | `Progress` (tinggi 12px, warna `accent`→`primary`) |
| Notifikasi | `Toast` |
| Loading | `Spinner` + skeleton kustom |
| Sidebar desktop | `Sidebar` |
| Menu profil | `Dropdown`, `Avatar` |
| Tooltip | `Tooltip` |
| Peringatan | `Alert` |

Kustomisasi di `src/lib/flowbite-theme.ts` dengan `createTheme`, dan terapkan lewat provider tema Flowbite React di root. Pastikan **tidak ada** warna bawaan Flowbite (cyan/biru) yang tampil: semua `color="info"` diganti tema `primary`. Cek dokumentasi Flowbite React versi terpasang untuk sintaks tema yang tepat.

Komponen kustom (Tailwind + token): `BottomNav`, `CounterButton`, `CalendarHeatmap`, `EmojiPicker`, `MoodPicker`, `StreakBadge`, `BlobBackground`.

## 5. Komponen Kunci

### Kartu Kebiasaan (halaman Hari Ini)
- Kiri: emoji 40px dalam lingkaran `good-soft`/`bad-soft`. Tengah: nama, chip kategori, streak 🔥 (baik) atau "🧊 N hari bebas" (buruk).
- Kanan: **hitungan hari ini** (angka besar Outfit) dengan tombol **+** bulat besar (min 48×48px) dan tombol **−** kecil.
- Border kiri tipis berwarna `good` atau `bad`.
- Baris mood kecil (5 emoji) muncul setelah ada hitungan > 0.

### Tombol +1
- Bulat, `bg-primary text-on-primary`, `shadow-glow`.
- Saat ditekan: skala 0.92 (press), lalu angka "pop" (1 → 1.25 → 1, spring) dan teks "+1" melayang naik lalu memudar.
- Untuk kebiasaan buruk tombolnya berwarna `bad-soft` dengan teks `bad` (tidak mencolok, tidak memberi kesan "reward").

### Kartu Level
- Gradien senja, nama level, `XpBar`, sisa XP menuju level berikut.

### Empty state
- Emoji besar (64px) + judul + satu kalimat + satu tombol aksi. Contoh: "Belum ada kebiasaan 🌱 — yuk mulai dari satu hal kecil" + tombol "Tambah kebiasaan".

## 6. Gerak & Animasi Mikro

Pakai library `motion`. Spring default: `{ type: "spring", stiffness: 400, damping: 17 }`.

| Momen | Animasi |
|---|---|
| Tekan tombol/kartu | `whileTap: scale 0.95` |
| Hover kartu (desktop) | naik 2px + `shadow-glow` |
| Angka bertambah | pop 1 → 1.25 → 1 |
| Daftar muncul | stagger fade-up 40ms per item |
| Buka modal | skala dari 0.95 + fade |
| Pindah halaman | fade 150ms |
| Streak naik | api 🔥 bergoyang singkat |
| Level up / badge baru / hari sempurna | **confetti** (warna: primary, secondary, accent, good) |
| Emoji hero | melayang pelan (loop 4s) |

Aturan: durasi singkat (≤ 400ms kecuali loop dekoratif), tidak ada animasi yang memblokir interaksi, dan **semua dimatikan bila `prefers-reduced-motion`** (gunakan `MotionConfig reducedMotion="user"` dan lewati confetti).

## 7. Grafik (ApexCharts)

- Latar transparan, font Plus Jakarta Sans, teks `muted`, grid `border` putus-putus tipis.
- Seri **baik** = `good`, seri **buruk** = `bad`. Batang berujung membulat (`borderRadius` besar).
- Tooltip tema gelap. Legend di atas, rata kiri.
- Donat: ketebalan sedang, angka persen di tengah (font Outfit).
- Setiap grafik dibungkus `ChartCard` dengan judul, subjudul, dan skeleton saat memuat.
- Tidak mengandalkan warna saja: sertakan label/legend dan angka agar terbaca.

## 8. Panduan Copy (Bahasa Indonesia, Gen Z, tidak menghakimi)

Nada: santai, hangat, sedikit jenaka, suportif. Gunakan "kamu". Hindari slang berlebihan dan kata kasar. Kebiasaan buruk **tidak pernah** dimarahi.

| Konteks | Contoh |
|---|---|
| Sapaan | "Hai, {nama}! Gimana hari ini?" |
| Log baik | "Mantap, lanjut terus! 💪", "Satu langkah kecil, dampak gede ✨", "Konsisten itu keren 🔥" |
| Log buruk | "Gapapa, yang penting kamu jujur sama diri sendiri 🫶", "Dicatat ya. Besok kita coba lebih santai 🌙" |
| Streak naik | "Streak {n} hari! Jangan putus ya 🔥" |
| Hari sempurna | "Semua kebiasaan baik hari ini beres! 🎉" |
| Level up | "Naik ke Level {n}! 🚀" |
| Hari bebas | "{n} hari bebas, kamu keren banget 🧊" |
| Empty state | "Belum ada apa-apa di sini 🌱" |
| Error umum | "Waduh, ada yang error. Coba lagi ya 🙏" |
| Offline | "Lagi offline, tenang, catatanmu aman dan bakal disinkronkan nanti 📴" |

Pesan acak disimpan di `src/lib/copy.ts` (array per konteks) agar mudah diubah dan tidak tersebar di komponen.

## 9. Aksesibilitas

- Target sentuh minimal 44×44px.
- Fokus terlihat: ring 2px `primary` dengan offset.
- Tombol ikon punya `aria-label` berbahasa Indonesia ("Tambah satu", "Kurangi satu").
- Perubahan hitungan diumumkan lewat `aria-live="polite"`.
- Informasi kategori tidak hanya lewat warna: selalu ada teks/ikon ("Baik"/"Buruk").
