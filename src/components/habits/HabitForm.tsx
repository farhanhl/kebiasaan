"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, type HabitFormInput } from "@/lib/schemas";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TextInput,
  Textarea,
  HelperText,
  Spinner,
} from "flowbite-react";
import { HiSparkles, HiHandRaised } from "react-icons/hi2";
import type { Habit, HabitCategory } from "@/types/habit";
import { EmojiPicker } from "./EmojiPicker";
import { todayKey } from "@/lib/date";

interface HabitFormProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: HabitFormInput) => Promise<void>;
  habit?: Habit | null; // If provided -> edit mode
}

export function HabitForm({
  show,
  onClose,
  onSubmit,
  habit,
}: HabitFormProps) {
  const isEditing = Boolean(habit);
  const today = todayKey();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      category: "good",
      emoji: "🌱",
      note: "",
      startDate: today,
    },
  });

  const selectedCategory = watch("category");
  const selectedEmoji = watch("emoji");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (show) {
      setFormError(null);
      if (habit) {
        reset({
          name: habit.name,
          category: habit.category,
          emoji: habit.emoji,
          note: habit.note || "",
          startDate: habit.startDate || today,
        });
      } else {
        reset({
          name: "",
          category: "good",
          emoji: "🌱",
          note: "",
          startDate: today,
        });
      }
    }
  }, [show, habit, reset, today]);

  const handleCategoryChange = (cat: HabitCategory) => {
    if (isEditing) return; // Category locked in edit mode
    setValue("category", cat);
    if (!habit) {
      setValue("emoji", cat === "good" ? "🌱" : "🍟");
    }
  };

  const handleFormSubmit = async (data: HabitFormInput) => {
    try {
      setFormError(null);
      await onSubmit(data);
      onClose();
    } catch (err: unknown) {
      console.error("Gagal menyimpan kebiasaan:", err);
      const msg = (err as Error)?.message || "";
      if (
        msg.includes("offline") ||
        msg.includes("unavailable") ||
        msg.includes("404") ||
        msg.includes("not-found")
      ) {
        setFormError(
          "Tidak dapat terhubung ke database. Pastikan database Cloud Firestore sudah dibuat di Firebase Console."
        );
      } else if (msg.includes("permission") || msg.includes("denied")) {
        setFormError(
          "Akses ditolak. Pastikan kamu sudah login dan aturan (Rules) Firestore mengizinkan penulisan."
        );
      } else {
        setFormError("Gagal menyimpan kebiasaan. Silakan periksa koneksi dan coba lagi.");
      }
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="md">
      <ModalHeader>
        {isEditing ? "Ubah Kebiasaan" : "Tambah Kebiasaan Baru"}
      </ModalHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <ModalBody className="space-y-4">
          {formError && (
            <div className="rounded-2xl border border-bad/30 bg-bad/10 p-3 text-xs text-bad">
              {formError}
            </div>
          )}
          {/* Category selection */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted">
              Kategori Kebiasaan
            </label>
            {isEditing ? (
              <div className="rounded-2xl border border-border bg-surface-raised p-3 text-sm text-fg">
                <span className="font-semibold">
                  {habit?.category === "good"
                    ? "Kebiasaan Baik"
                    : "Kebiasaan Buruk"}
                </span>
                <p className="mt-1 text-xs text-muted">
                  Kategori tidak dapat diubah setelah dibuat untuk menjaga konsistensi rekap.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleCategoryChange("good")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${selectedCategory === "good"
                      ? "border-emerald-600/50 bg-emerald-950/30 text-emerald-300 font-semibold shadow-sm ring-1 ring-emerald-500/20"
                      : "border-border/70 bg-surface/50 text-muted hover:border-border hover:text-fg hover:bg-surface/80"
                    }`}
                >
                  <HiSparkles className={`h-5 w-5 ${selectedCategory === "good" ? "text-emerald-400" : "text-muted"}`} />
                  <span className="text-sm">Kebiasaan Baik</span>
                  <span className={`text-[10px] ${selectedCategory === "good" ? "text-emerald-400/80" : "text-muted"}`}>
                    Ingin dipertahankan
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange("bad")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${selectedCategory === "bad"
                      ? "border-rose-700/50 bg-rose-950/30 text-rose-300 font-semibold shadow-sm ring-1 ring-rose-500/20"
                      : "border-border/70 bg-surface/50 text-muted hover:border-border hover:text-fg hover:bg-surface/80"
                    }`}
                >
                  <HiHandRaised className={`h-5 w-5 ${selectedCategory === "bad" ? "text-rose-400" : "text-muted"}`} />
                  <span className="text-sm">Kebiasaan Buruk</span>
                  <span className={`text-[10px] ${selectedCategory === "bad" ? "text-rose-400/80" : "text-muted"}`}>
                    Ingin dikurangi
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Name input */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Nama Kebiasaan <span className="text-bad">*</span>
            </label>
            <TextInput
              placeholder={
                selectedCategory === "good"
                  ? "mis. Minum air putih 2L"
                  : "mis. Begadang main HP"
              }
              {...register("name")}
              color={errors.name ? "failure" : "gray"}
            />
            {errors.name?.message && (
              <HelperText color="failure" className="mt-1">
                {errors.name.message}
              </HelperText>
            )}
          </div>

          {/* Emoji Picker */}
          <Controller
            control={control}
            name="emoji"
            render={({ field }) => (
              <EmojiPicker
                selected={field.value || selectedEmoji}
                onSelect={(emoji) => field.onChange(emoji)}
              />
            )}
          />

          {/* Start Date */}
          {!isEditing && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">
                Tanggal Mulai
              </label>
              <TextInput
                type="date"
                max={today}
                {...register("startDate")}
                color={errors.startDate ? "failure" : "gray"}
              />
              {errors.startDate?.message && (
                <HelperText color="failure" className="mt-1">
                  {errors.startDate.message}
                </HelperText>
              )}
            </div>
          )}

          {/* Note */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Catatan / Alasan (Opsional)
            </label>
            <Textarea
              rows={2}
              placeholder="Catatan motivasi atau alasan kamu ingin melakukan/mengurangi kebiasaan ini..."
              {...register("note")}
              color={errors.note ? "failure" : "gray"}
            />
            {errors.note?.message && (
              <HelperText color="failure" className="mt-1">
                {errors.note.message}
              </HelperText>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2 border-t-0 p-5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-border/80 bg-surface/50 px-5 py-2.5 text-xs font-semibold text-muted hover:bg-surface hover:text-fg transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-on-primary hover:bg-primary-hover focus:ring-4 focus:ring-primary/20 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <Spinner size="sm" />
                <span>Menyimpan...</span>
              </div>
            ) : isEditing ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Kebiasaan"
            )}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

