"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export function useUserAndTheme() {
  const { data: session, status, update } = useSession();
  const [userName, setUserName] = useState<string>("Your");
  const [theme, setTheme] = useState<string | null>(null);
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (isAuthenticated && session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session?.user?.name, isAuthenticated]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return newTheme;
    });
  };

  const handleSignIn = async () => {
    await signIn("google");
    await update();
  };

  const handleSignOut = async () => {
    await signOut();
    setUserName("Your");
  };

  return {
    userName,
    theme,
    toggleTheme,
    handleSignIn,
    handleSignOut,
    isAuthenticated,
  };
}
