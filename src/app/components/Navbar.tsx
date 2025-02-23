"use client";

import { useSession } from "next-auth/react";
import AuthDropdown from "./AuthDropdown";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({
  userName,
  handleSignIn,
  handleSignOut,
  theme,
  toggleTheme,
}: {
  userName: string;
  handleSignIn: () => void;
  handleSignOut: () => void;
  theme: string;
  toggleTheme: () => void;
}) {
  const { data: session } = useSession();
  return (
    <nav
      className={`fixed top-0 left-0 w-full shadow-md z-50 h-16 px-4 flex justify-between items-center 
      ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <AuthDropdown
        userName={userName}
        profileImage={session?.user?.image ?? undefined}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        theme={theme}
      />
    </nav>
  );
}
