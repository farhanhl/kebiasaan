import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./client";
import type { Habit, HabitInput, HabitPatch } from "@/types/habit";
import { todayKey } from "../date";
import { evaluateCleanBadges } from "./users";

export async function createHabit(
  uid: string,
  input: HabitInput
): Promise<string> {
  const habitsCol = collection(db, "users", uid, "habits");
  const today = todayKey();

  const docRef = await addDoc(habitsCol, {
    name: input.name.trim(),
    category: input.category,
    emoji: input.emoji?.trim() || "",
    note: input.note?.trim() || "",
    startDate: input.startDate || today,
    isArchived: false,
    totalCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastLogDate: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateHabit(
  uid: string,
  habitId: string,
  patch: HabitPatch
): Promise<void> {
  const habitRef = doc(db, "users", uid, "habits", habitId);
  const data: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (patch.name !== undefined) data.name = patch.name.trim();
  if (patch.emoji !== undefined) data.emoji = patch.emoji.trim();
  if (patch.note !== undefined) data.note = patch.note.trim();

  await updateDoc(habitRef, data);
}

export async function setHabitArchived(
  uid: string,
  habitId: string,
  archived: boolean
): Promise<void> {
  const habitRef = doc(db, "users", uid, "habits", habitId);
  await updateDoc(habitRef, {
    isArchived: archived,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteHabit(uid: string, habitId: string): Promise<void> {
  const habitRef = doc(db, "users", uid, "habits", habitId);

  // Fetch all logs associated with this habit
  const logsCol = collection(db, "users", uid, "logs");
  const q = query(logsCol, where("habitId", "==", habitId));
  const logsSnap = await getDocs(q);

  // Delete logs in chunks of 450 (batch limit 500)
  const batchSize = 450;
  const docs = logsSnap.docs;

  for (let i = 0; i < docs.length; i += batchSize) {
    const chunk = docs.slice(i, i + batchSize);
    const batch = writeBatch(db);
    for (const d of chunk) {
      batch.delete(d.ref);
    }
    await batch.commit();
  }

  // Finally delete the habit document
  await deleteDoc(habitRef);
}

export function subscribeHabits(
  uid: string,
  cb: (habits: Habit[]) => void,
  onError?: (error: Error) => void
) {
  const habitsCol = collection(db, "users", uid, "habits");
  const q = query(habitsCol, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snap) => {
      const habits: Habit[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Habit, "id">),
      }));
      cb(habits);

      // Evaluate clean badges asynchronously
      const today = todayKey();
      evaluateCleanBadges(uid, habits, today).catch(() => {
        // Handled internally in evaluateCleanBadges
      });
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

