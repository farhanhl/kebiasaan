import {
  doc,
  getDoc,
  getDocFromCache,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db, auth } from "./client";
import { updateProfile } from "firebase/auth";
import type { UserProfile, BadgeId } from "@/types/user";
import type { Habit } from "@/types/habit";
import { evaluateBadges } from "../gamification";
import { badgeMeta } from "../copy";

export async function ensureUserDoc(user: User): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  let snap;
  try {
    snap = await getDoc(userRef);
  } catch {
    try {
      snap = await getDocFromCache(userRef);
    } catch {
      // Offline and not in cache yet
      snap = null;
    }
  }

  if (!snap || !snap.exists()) {
    try {
      await setDoc(userRef, {
        displayName: user.displayName || "Teman",
        email: user.email || "",
        timezone: "Asia/Jakarta",
        xp: 0,
        level: 1,
        dailyStreak: 0,
        longestDailyStreak: 0,
        lastActiveDate: null,
        totalGoodLogs: 0,
        totalBadLogs: 0,
        badges: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Offline write will queue up in persistentLocalCache
    }
  }
}

export async function updateDisplayName(uid: string, name: string): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    displayName: name,
    updatedAt: serverTimestamp(),
  });

  if (auth.currentUser && auth.currentUser.uid === uid) {
    await updateProfile(auth.currentUser, { displayName: name });
  }
}

export function subscribeUser(
  uid: string,
  cb: (user: UserProfile | null) => void,
  onError?: (error: Error) => void
) {
  const userRef = doc(db, "users", uid);
  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        cb({ uid: snap.id, ...(snap.data() as Omit<UserProfile, "uid">) });
      } else {
        cb(null);
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export async function evaluateCleanBadges(
  uid: string,
  habits: Habit[],
  today: string
): Promise<BadgeId[]> {
  try {
    const userRef = doc(db, "users", uid);
    let snap;
    try {
      snap = await getDoc(userRef);
    } catch {
      try {
        snap = await getDocFromCache(userRef);
      } catch {
        // Offline and document not in local cache yet -> silently skip until online
        return [];
      }
    }

    if (!snap || !snap.exists()) return [];

    const userData = snap.data() as UserProfile;
    const newBadges = evaluateBadges(userData, habits, today);

    if (newBadges.length > 0) {
      let bonusXp = 0;
      const badgeUpdates: Record<string, unknown> = {};

      for (const badgeId of newBadges) {
        bonusXp += badgeMeta[badgeId].xp;
        badgeUpdates[`badges.${badgeId}`] = serverTimestamp();
      }

      await updateDoc(userRef, {
        ...badgeUpdates,
        xp: (userData.xp || 0) + bonusXp,
        updatedAt: serverTimestamp(),
      });
    }

    return newBadges;
  } catch (err: unknown) {
    // Only log if it's not a standard offline condition
    const msg = (err as Error)?.message || "";
    if (!msg.includes("offline") && (err as { code?: string })?.code !== "unavailable") {
      console.warn("evaluateCleanBadges notice:", err);
    }
    return [];
  }
}

