"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { loginUser, mapAuthError } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { Button, TextInput, HelperText, Spinner } from "flowbite-react";
import Link from "next/link";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setAuthError(null);
      await loginUser(data);
      router.replace("/hari-ini");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "unknown";
      setAuthError(mapAuthError(code));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold font-display text-fg">Masuk Akun</h2>
        <p className="text-xs text-muted">Selamat datang kembali! Yuk lanjut catat.</p>
      </div>

      {authError && (
        <div className="rounded-2xl border border-bad/30 bg-bad-soft p-3 text-xs text-bad">
          {authError}
        </div>
      )}

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

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-medium text-muted">Password</label>
          <Link
            href="/lupa-password"
            className="text-xs text-primary hover:underline"
          >
            Lupa password?
          </Link>
        </div>
        <div className="relative">
          <TextInput
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            color={errors.password ? "failure" : "gray"}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            className="absolute right-3 top-3 text-muted hover:text-fg"
          >
            {showPassword ? (
              <HiEyeSlash className="h-5 w-5" />
            ) : (
              <HiEye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password?.message && (
          <HelperText color="failure" className="mt-1">
            {errors.password.message}
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
            <span>Memeriksa...</span>
          </div>
        ) : (
          "Masuk"
        )}
      </Button>

      <div className="pt-2 text-center text-xs text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-primary hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </form>
  );
}
