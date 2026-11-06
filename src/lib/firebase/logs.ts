import {
  doc,
  collection,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  setDoc,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  type DocumentReference,
  type DocumentSnapshot,
  type Query,
  type QuerySnapshot,
} from "firebase/firestore";
import { db } from "./client";
import type { Habit } from "@/types/habit";
import type { HabitLog, LogContext, LogResult, Mood } from "@/types/log";
import type { UserDoc } from "@/types/user";
import {
  calcXpGain,
  calcLevel,
  calcFreeDays,
  evaluateBadges,
  recomputeStreak,
  updateStreakOnGoodLog,
  XP_PER_GOOD_LOG,
} from "../gamification";
import { isYesterday } from "../date";
import { badgeMeta } from "../copy";

async function getDocSafe(ref: DocumentReference): Promise<DocumentSnapshot> {
  try {
    return await getDoc(ref);
  } catch {
    return await getDocFromCache(ref);
  }
}

async function getDocsSafe(q: Query): Promise<QuerySnapshot> {
  try {
    return await getDocs(q);
  } catch {
    return await getDocsFromCache(q);
  }
}

export async function incrementLog(
  uid: string,
  habit: Habit,
  ctx: LogContext
): Promise<LogResult> {
  const { date, weekKey, monthKey } = ctx;
  const docId = `${date}_${habit.id}`;
  const logRef = doc(db, "users", uid, "logs", docId);
  const habitRef = doc(db, "users", uid, "habits", habit.id);
  const userRef = doc(db, "users", uid);

  // Read current log and user snapshot
  const [logSnap, userSnap] = await Promise.all([
    getDocSafe(logRef),
    getDocSafe(userRef),
  ]);

  const currentCount = logSnap.exists() ? (logSnap.data().count || 0) : 0;
  if (currentCount >= 999) {
    return {
      count: currentCount,
      xpDelta: 0,
      levelUp: false,
      newBadges: [],
      perfectDay: false,
    };
  }

  const nextCount = currentCount + 1;
  const userData = (userSnap.exists() ? userSnap.data() : {}) as Partial<UserDoc>;
  const isGood = habit.category === "good";

  // XP calculation
  const xpDelta = calcXpGain(habit.category, currentCount);
  const oldXp = userData.xp || 0;
  const oldLevel = userData.level || calcLevel(oldXp);
  let newXp = oldXp + xpDelta;

  const batch = writeBatch(db);

  // 1. Log Doc
  const logPayload: Record<string, unknown> = {
    habitId: habit.id,
    category: habit.category,
    date,
    weekKey,
    monthKey,
    count: increment(1),
    xpEarned: increment(xpDelta),
    updatedAt: serverTimestamp(),
  };
  if (!logSnap.exists()) {
    logPayload.createdAt = serverTimestamp();
  }
  batch.set(logRef, logPayload, { merge: true });

  // 2. Habit Doc
  const habitUpdates: Record<string, unknown> = {
    totalCount: increment(1),
    updatedAt: serverTimestamp(),
  };

  if (isGood) {
    const { currentStreak: nextHabitStreak, longestStreak: nextLongestHabitStreak } =
      updateStreakOnGoodLog(
        habit.lastLogDate,
        habit.currentStreak,
        habit.longestStreak,
        date
      );

    habitUpdates.currentStreak = nextHabitStreak;
    habitUpdates.longestStreak = nextLongestHabitStreak;
    habitUpdates.lastLogDate = date;
  } else {
    // Bad habit: update longestStreak (record clean days) then reset lastLogDate
    const gap = calcFreeDays(habit.startDate, habit.lastLogDate, date);
    habitUpdates.longestStreak = Math.max(habit.longestStreak, gap);
    habitUpdates.lastLogDate = date;
  }

  batch.update(habitRef, habitUpdates);

  // 3. User Doc updates
  const userUpdates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (isGood) {
    userUpdates.totalGoodLogs = increment(1);

    const {
      currentStreak: nextUserStreak,
      longestStreak: nextLongestUserStreak,
      isFirstLogToday,
    } = updateStreakOnGoodLog(
      userData.lastActiveDate || null,
      userData.dailyStreak || 0,
      userData.longestDailyStreak || 0,
      date
    );

    if (isFirstLogToday) {
      userUpdates.dailyStreak = nextUserStreak;
      userUpdates.longestDailyStreak = nextLongestUserStreak;
      userUpdates.lastActiveDate = date;
    }
  } else {
    userUpdates.totalBadLogs = increment(1);
  }

  // Check badges with updated simulated state
  const simulatedUser: Partial<UserDoc> = {
    ...userData,
    xp: newXp,
    totalGoodLogs: (userData.totalGoodLogs || 0) + (isGood ? 1 : 0),
    totalBadLogs: (userData.totalBadLogs || 0) + (!isGood ? 1 : 0),
    dailyStreak: isGood
      ? (userData.lastActiveDate === date
          ? userData.dailyStreak
          : isYesterday(userData.lastActiveDate || "", date)
          ? (userData.dailyStreak || 0) + 1
          : 1)
      : userData.dailyStreak,
  };

  const newBadges = evaluateBadges(simulatedUser, [habit], date);
  if (newBadges.length > 0) {
    for (const bId of newBadges) {
      newXp += badgeMeta[bId].xp;
      userUpdates[`badges.${bId}`] = serverTimestamp();
    }
  }

  const newLevel = calcLevel(newXp);
  const levelUp = newLevel > oldLevel;

  userUpdates.xp = newXp;
  userUpdates.level = newLevel;

  batch.update(userRef, userUpdates);

  await batch.commit();

  return {
    count: nextCount,
    xpDelta,
    levelUp,
    newBadges,
    perfectDay: false, // Hari sempurna akan dievaluasi oleh useTodayLogs di UI
  };
}

export async function decrementLog(
  uid: string,
  habit: Habit,
  ctx: LogContext
): Promise<LogResult> {
  const { date } = ctx;
  const docId = `${date}_${habit.id}`;
  const logRef = doc(db, "users", uid, "logs", docId);
  const habitRef = doc(db, "users", uid, "habits", habit.id);
  const userRef = doc(db, "users", uid);

  const [logSnap, userSnap] = await Promise.all([
    getDocSafe(logRef),
    getDocSafe(userRef),
  ]);

  if (!logSnap.exists()) {
    return {
      count: 0,
      xpDelta: 0,
      levelUp: false,
      newBadges: [],
      perfectDay: false,
    };
  }

  const logData = logSnap.data();
  const currentCount = logData.count || 0;
  if (currentCount <= 0) {
    return {
      count: 0,
      xpDelta: 0,
      levelUp: false,
      newBadges: [],
      perfectDay: false,
    };
  }

  const nextCount = currentCount - 1;
  const isGood = habit.category === "good";
  const xpEarnedInLog = logData.xpEarned || 0;

  // XP to revert (only if good habit and log previously earned XP)
  const xpToRevert = isGood && xpEarnedInLog > 0 ? XP_PER_GOOD_LOG : 0;
  const userData = (userSnap.exists() ? userSnap.data() : {}) as Partial<UserDoc>;
  const oldXp = userData.xp || 0;
  const newXp = Math.max(0, oldXp - xpToRevert);
  const currentLevel = userData.level || 1;

  const batch = writeBatch(db);

  if (nextCount === 0) {
    // Delete log doc if count reaches 0
    batch.delete(logRef);
  } else {
    batch.update(logRef, {
      count: increment(-1),
      xpEarned: increment(-xpToRevert),
      updatedAt: serverTimestamp(),
    });
  }

  // Update habit total count
  const habitUpdates: Record<string, unknown> = {
    totalCount: increment(-1),
    updatedAt: serverTimestamp(),
  };

  // If count reaches 0, recompute streak (good) or roll back lastLogDate to previous log date
  if (nextCount === 0) {
    const logsCol = collection(db, "users", uid, "logs");
    const q = query(
      logsCol,
      where("habitId", "==", habit.id),
      orderBy("date", "desc"),
      limit(60)
    );
    const pastLogsSnap = await getDocsSafe(q);
    const remainingDates = pastLogsSnap.docs
      .filter((d) => d.id !== docId)
      .map((d) => d.data().date as string);

    if (isGood) {
      const recomputed = recomputeStreak(remainingDates, date);
      habitUpdates.currentStreak = recomputed;
      habitUpdates.lastLogDate = remainingDates.length > 0 ? remainingDates[0] : null;
    } else {
      // Bad habit: rollback lastLogDate to previous log date (or null if never committed before)
      habitUpdates.lastLogDate = remainingDates.length > 0 ? remainingDates[0] : null;
    }
  }

  batch.update(habitRef, habitUpdates);

  // Update user doc
  const userUpdates: Record<string, unknown> = {
    xp: newXp,
    level: Math.max(currentLevel, calcLevel(newXp)), // Level never decreases
    updatedAt: serverTimestamp(),
  };

  if (isGood) {
    userUpdates.totalGoodLogs = increment(-1);
  } else {
    userUpdates.totalBadLogs = increment(-1);
  }

  batch.update(userRef, userUpdates);

  await batch.commit();

  return {
    count: nextCount,
    xpDelta: -xpToRevert,
    levelUp: false,
    newBadges: [],
    perfectDay: false,
  };
}

export async function setMood(
  uid: string,
  habit: Habit,
  date: string,
  mood: Mood | null
): Promise<void> {
  const docId = `${date}_${habit.id}`;
  const logRef = doc(db, "users", uid, "logs", docId);
  await setDoc(
    logRef,
    {
      mood,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function subscribeTodayLogs(
  uid: string,
  today: string,
  cb: (logs: HabitLog[]) => void,
  onError?: (err: Error) => void
) {
  const logsCol = collection(db, "users", uid, "logs");
  const q = query(logsCol, where("date", "==", today));

  return onSnapshot(
    q,
    (snap) => {
      const logs = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<HabitLog, "id">),
      }));
      cb(logs);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export function subscribeLogsRange(
  uid: string,
  startDate: string,
  endDate: string,
  cb: (logs: HabitLog[]) => void,
  onError?: (err: Error) => void
) {
  const logsCol = collection(db, "users", uid, "logs");
  const q = query(
    logsCol,
    where("date", ">=", startDate),
    where("date", "<=", endDate),
    orderBy("date", "asc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const logs = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<HabitLog, "id">),
      }));
      cb(logs);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export function subscribeHabitLogs(
  uid: string,
  habitId: string,
  limitCount: number = 60,
  cb: (logs: HabitLog[]) => void,
  onError?: (err: Error) => void
) {
  const logsCol = collection(db, "users", uid, "logs");
  const q = query(
    logsCol,
    where("habitId", "==", habitId),
    orderBy("date", "desc"),
    limit(limitCount)
  );

  return onSnapshot(
    q,
    (snap) => {
      const logs = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<HabitLog, "id">),
      }));
      cb(logs);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}
