import type { BadgeId } from "@/types/user";

export const copy = {
  sapaan: [
    "Hai, {nama}! Gimana harimu?",
    "Halo, {nama}! Semangat menjalani hari ya.",
    "Yuk, {nama}! Satu langkah kecil hari ini.",
  ],
  goodLog: [
    "Mantap, lanjut terus!",
    "Satu langkah kecil, dampak gede.",
    "Konsisten itu keren.",
    "Keren banget kamu hari ini!",
    "Sedikit demi sedikit jadi kebiasaan.",
  ],
  badLog: [
    "Gapapa, yang penting kamu jujur sama diri sendiri.",
    "Dicatat ya. Besok kita coba lebih santai.",
    "Nggak apa-apa terpeleset, besok mulai lagi.",
    "Jujur itu langkah pertama untuk berubah.",
  ],
  streak: [
    "Streak {n} hari! Jangan putus ya.",
    "Konsistensimu luar biasa! {n} hari nonstop.",
  ],
  cleanStreak: [
    "{n} hari bebas, kamu keren banget.",
    "Sudah {n} hari bertahan! Tetap tenang.",
  ],
  perfectDay: "Semua kebiasaan baik hari ini beres!",
  levelUp: "Naik ke Level {n}!",
  badgeUnlocked: "Kamu membuka lencana baru: {name}!",
  offline:
    "Lagi offline, tenang, catatanmu aman dan bakal disinkronkan nanti.",
  online: "Koneksi tersambung kembali, data sudah sinkron.",
  errorGeneral: "Waduh, ada yang error. Coba lagi ya.",
  emptyToday: "Belum ada kebiasaan — yuk mulai dari satu hal kecil.",
  emptyDashboard: "Belum ada catatan. Mulai dari Hari Ini ya.",
  emptyHabits: "Kamu belum punya kebiasaan yang dicatat.",
};

export const badgeMeta: Record<
  BadgeId,
  { name: string; emoji: string; desc: string; xp: number }
> = {
  first_habit: {
    name: "Langkah Pertama",
    emoji: "🌱",
    desc: "Membuat kebiasaan pertama",
    xp: 10,
  },
  first_log: {
    name: "Gas Pertama",
    emoji: "⚡",
    desc: "Log pertama kali (baik atau buruk)",
    xp: 10,
  },
  streak_3: {
    name: "Api Kecil",
    emoji: "🔥",
    desc: "Daily streak mencapai 3 hari",
    xp: 20,
  },
  streak_7: {
    name: "Seminggu Konsisten",
    emoji: "🌅",
    desc: "Daily streak mencapai 7 hari",
    xp: 50,
  },
  streak_30: {
    name: "Sebulan Nonstop",
    emoji: "👑",
    desc: "Daily streak mencapai 30 hari",
    xp: 200,
  },
  clean_7: {
    name: "Seminggu Bebas",
    emoji: "🧊",
    desc: "7 hari bebas dari salah satu kebiasaan buruk",
    xp: 50,
  },
  clean_30: {
    name: "Sebulan Bersih",
    emoji: "💎",
    desc: "30 hari bebas dari salah satu kebiasaan buruk",
    xp: 200,
  },
  logs_100: {
    name: "Seratus Catatan",
    emoji: "💯",
    desc: "Mencapai 100 total log kebiasaan baik",
    xp: 100,
  },
  habit_5: {
    name: "Kolektor Kebiasaan",
    emoji: "🧺",
    desc: "Memiliki 5 kebiasaan aktif",
    xp: 20,
  },
};

let lastGoodIdx = -1;
let lastBadIdx = -1;

export function getRandomGoodMessage(): string {
  const pool = copy.goodLog;
  let idx = Math.floor(Math.random() * pool.length);
  if (idx === lastGoodIdx && pool.length > 1) {
    idx = (idx + 1) % pool.length;
  }
  lastGoodIdx = idx;
  return pool[idx];
}

export function getRandomBadMessage(): string {
  const pool = copy.badLog;
  let idx = Math.floor(Math.random() * pool.length);
  if (idx === lastBadIdx && pool.length > 1) {
    idx = (idx + 1) % pool.length;
  }
  lastBadIdx = idx;
  return pool[idx];
}

