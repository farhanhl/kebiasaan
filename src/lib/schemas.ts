import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Format email belum benar."),
  password: z.string().min(1, "Password tidak boleh kosong."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter.")
      .max(30, "Nama maksimal 30 karakter."),
    email: z.string().trim().email("Format email belum benar."),
    password: z.string().min(8, "Password terlalu lemah, minimal 8 karakter ya."),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Format email belum benar."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const habitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama kebiasaan wajib diisi.")
    .max(60, "Nama kebiasaan maksimal 60 karakter."),
  category: z.enum(["good", "bad"] as const),
  emoji: z.string().min(1, "Emoji wajib ada."),
  note: z.string().max(200, "Catatan maksimal 200 karakter."),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
});

export type HabitFormInput = z.infer<typeof habitSchema>;

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(30, "Nama maksimal 30 karakter."),
});

export type ProfileInput = z.infer<typeof profileSchema>;

