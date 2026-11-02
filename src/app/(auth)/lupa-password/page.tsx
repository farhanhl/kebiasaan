import { ForgotForm } from "@/components/auth/ForgotForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password — Kebiasaan",
  description: "Reset password akun Kebiasaan kamu",
};

export default function LupaPasswordPage() {
  return <ForgotForm />;
}

