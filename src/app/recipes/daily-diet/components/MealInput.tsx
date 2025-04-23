"use client";

import { ChangeEvent } from "react";

interface MealInputProps {
  label: string;
  value: string;
  notes: string;
  onValueChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export default function MealInput({
  label,
  value,
  notes,
  onValueChange,
  onNotesChange,
}: MealInputProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2 text-green-800">{label}</h2>
      <input
        type="text"
        placeholder="Food item"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onNotesChange(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      ></textarea>
    </div>
  );
}
