import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — Kebiasaan",
  description: "Masuk ke akun Kebiasaan kamu",
};

export default function MasukPage() {
  return <LoginForm />;
}

