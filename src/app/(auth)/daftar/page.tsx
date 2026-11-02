import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar — Kebiasaan",
  description: "Daftar akun Kebiasaan baru",
};

export default function DaftarPage() {
  return <RegisterForm />;
}

