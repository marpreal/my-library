"use client";

import { PlaneTakeoff } from "lucide-react";

export default function LoginIcon({
  handleSignIn,
  theme,
}: {
  handleSignIn: () => void;
  theme: string;
}) {
  return (
    <button
      onClick={handleSignIn}
      className="flex items-center justify-center p-3 rounded-full transition hover:scale-110 focus:outline-none"
    >
      <PlaneTakeoff
        className={`w-10 h-10 transition ${
          theme === "dark" ? "text-blue-300 hover:text-blue-400" : "text-green-600 hover:text-green-700"
        }`}
      />
    </button>
  );
}
