"use client";

import React, { useEffect } from "react";
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

  useEffect(() => {
    if (show) {
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
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose} size="md">
      <ModalHeader>
        {isEditing ? "Ubah Kebiasaan" : "Tambah Kebiasaan Baru"}
      </ModalHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <ModalBody className="space-y-4">
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
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-4 text-center transition-all ${
                    selectedCategory === "good"
                      ? "border-good bg-good/15 text-good shadow-glow font-bold"
                      : "border-border bg-surface-raised/40 text-muted hover:border-good/50"
                  }`}
                >
                  <HiSparkles className="h-6 w-6 text-good" />
                  <span className="text-sm">Kebiasaan Baik</span>
                  <span className="text-[10px] text-muted">Ingin dipertahankan</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange("bad")}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-4 text-center transition-all ${
                    selectedCategory === "bad"
                      ? "border-bad bg-bad/15 text-bad shadow-glow font-bold"
                      : "border-border bg-surface-raised/40 text-muted hover:border-bad/50"
                  }`}
                >
                  <HiHandRaised className="h-6 w-6 text-bad" />
                  <span className="text-sm">Kebiasaan Buruk</span>
                  <span className="text-[10px] text-muted">Ingin dikurangi</span>
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

        <ModalFooter className="flex justify-end gap-2">
          <Button color="alternative" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button
            type="submit"
            color="default"
            disabled={isSubmitting}
            className="shadow-glow font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Menyimpan...</span>
              </div>
            ) : isEditing ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Kebiasaan"
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

