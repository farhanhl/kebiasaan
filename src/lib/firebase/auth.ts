import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "./client";
import { ensureUserDoc } from "./users";
import type { RegisterInput, LoginInput } from "../schemas";

export function mapAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email atau password salah.";
    case "auth/email-already-in-use":
      return "Email ini sudah terdaftar. Coba masuk aja.";
    case "auth/weak-password":
      return "Password terlalu lemah, minimal 8 karakter ya.";
    case "auth/invalid-email":
      return "Format email belum benar.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
    case "auth/network-request-failed":
      return "Koneksi bermasalah. Cek internetmu dulu.";
    default:
      return "Waduh, ada yang error. Coba lagi ya.";
  }
}

export async function registerUser({
  displayName,
  email,
  password,
}: RegisterInput) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await ensureUserDoc(credential.user);
  return credential.user;
}

export async function loginUser({ email, password }: LoginInput) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(credential.user);
  return credential.user;
}

export async function logoutUser() {
  await firebaseSignOut(auth);
}

export async function resetUserPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

