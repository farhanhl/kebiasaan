"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/schemas";
import { resetUserPassword } from "@/lib/firebase/auth";
import { Button, TextInput, HelperText, Spinner } from "flowbite-react";
import Link from "next/link";
import { HiEnvelopeOpen } from "react-icons/hi2";

export function ForgotForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await resetUserPassword(data.email);
    } catch (err) {
      console.error("reset password error:", err);
    } finally {
      setSubmitted(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold font-display text-fg">Lupa Password</h2>
        <p className="text-xs text-muted">
          Masukkan emailmu, kami akan mengirimkan link reset password.
        </p>
      </div>

      {submitted ? (
        <div className="space-y-4 rounded-2xl border border-good/30 bg-good-soft p-4 text-center">
          <HiEnvelopeOpen className="mx-auto h-10 w-10 text-good" />
          <p className="text-sm font-medium text-good">
            Kalau emailnya terdaftar, link reset sudah dikirim. Cek inbox atau folder spam kamu ya!
          </p>
          <Link href="/masuk">
            <Button color="alternative" className="w-full rounded-full">
              Kembali ke Halaman Masuk
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Email</label>
            <TextInput
              type="email"
              placeholder="nama@email.com"
              {...register("email")}
              color={errors.email ? "failure" : "gray"}
              autoComplete="email"
            />
            {errors.email?.message && (
              <HelperText color="failure" className="mt-1">
                {errors.email.message}
              </HelperText>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary font-semibold text-on-primary shadow-glow hover:bg-primary-hover focus:ring-4 focus:ring-primary/30"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Mengirim link...</span>
              </div>
            ) : (
              "Kirim Link Reset"
            )}
          </Button>

          <div className="pt-2 text-center text-xs text-muted">
            Ingat passwordmu?{" "}
            <Link href="/masuk" className="font-semibold text-primary hover:underline">
              Masuk di sini
            </Link>
          </div>
        </>
      )}
    </form>
  );
}
