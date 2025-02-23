"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 shadow-md transition duration-300"
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 text-yellow-400" />
      ) : (
        <Moon className="w-6 h-6 text-blue-500" />
      )}
    </button>
  );
}
