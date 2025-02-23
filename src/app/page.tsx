"use client";

import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import { categories } from "./components/Categories";
import { useUserAndTheme } from "./hooks/useUserAndTheme";
import { useTypingEffect } from "./hooks/useTypingEffect";

export default function Home() {
  const { userName, theme, toggleTheme, handleSignIn, handleSignOut } =
    useUserAndTheme();
  const router = useRouter();
  const title = useTypingEffect(userName);

  if (!userName || !theme) return null;

  return (
    <div
      className={`min-h-screen bg-cover bg-center ${
        theme === "dark"
          ? "bg-[url('/cybercore-bg.webp')] text-white"
          : "bg-[url('/cottagecore-background.jpg')] text-[#3a2f2f]"
      }`}
    >
      <Navbar
        userName={userName}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="container mx-auto px-4 pt-24 text-center">
        <h1 className={`text-4xl font-bold mb-8 title-text ${theme}`}>
          {title}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`shadow-md rounded-lg overflow-hidden cursor-pointer transition hover:scale-105
                ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-[#eae0c8] text-[#3a2f2f]"
                }
              `}
              onClick={() => router.push(category.link)}
            >
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.backgroundImage})` }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{category.title}</h2>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
