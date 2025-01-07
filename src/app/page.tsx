"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [activeSection, setActiveSection] = useState("books");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
    };
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div>
      <nav
        className="fixed top-0 left-0 w-full bg-brown-800 text-gold-500 shadow-md z-50 pointer-events-auto"
        style={{ height: "4rem", overflow: "hidden" }}
      >
        {" "}
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center gap-8">
          <button
            onClick={() => scrollToSection("books")}
            className={`text-lg font-semibold ${
              activeSection === "books" ? "text-gold-500" : "text-white"
            } transition`}
          >
            Books
          </button>
          <button
            onClick={() => scrollToSection("movies")}
            className={`text-lg font-semibold ${
              activeSection === "movies" ? "text-gold-500" : "text-white"
            } transition`}
          >
            Movies
          </button>
          <button
            onClick={() => scrollToSection("recipes")}
            className={`text-lg font-semibold ${
              activeSection === "recipes" ? "text-gold-500" : "text-white"
            } transition`}
          >
            Recipes
          </button>
        </div>
      </nav>

      <div
        id="books"
        className="h-screen flex items-center justify-center bg-center bg-cover relative"
        style={{
          backgroundImage: "url('/background.jpg')",
        }}
      >
        <div className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full border border-gray-200">
          <h1 className="text-5xl font-bold text-highlight mb-4 drop-shadow-md">
            Marta&apos;s Library
          </h1>
          <p className="text-gray-700 text-lg italic mb-6 hover:text-olive transition">
            Like BookReads but better.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/books"
              className="px-6 py-3 bg-accent text-highlight border-2 border-highlight rounded-full shadow-lg hover:shadow-xl hover:bg-highlight hover:text-olive transition transform hover:scale-105"
            >
              Explore Books
            </Link>
          </div>
        </div>
        <div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-7xl cursor-pointer hover:scale-110 transition animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          onClick={() => scrollToSection("movies")}
        >
          ↓
        </div>
      </div>

      <div
        id="movies"
        className="h-screen flex items-center justify-center bg-center bg-cover relative"
        style={{
          backgroundImage: "url('/movies-background.jpg')",
        }}
      >
        <div className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full border border-gray-200">
          <h2 className="text-5xl font-bold text-highlight mb-4 drop-shadow-md">
            Marta&apos;s Movie Collection
          </h2>
          <p className="text-gray-700 text-lg italic mb-6 hover:text-olive transition">
            A curated list of must-watch movies.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/movies"
              className="px-6 py-3 bg-accent text-highlight border-2 border-highlight rounded-full shadow-lg hover:shadow-xl hover:bg-highlight hover:text-olive transition transform hover:scale-105"
            >
              Explore Movies
            </Link>
          </div>
        </div>
        <div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-yellow-400 text-7xl cursor-pointer hover:scale-110 transition animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          onClick={() => scrollToSection("recipes")}
        >
          ↓
        </div>
        <div
          className="absolute top-10 left-1/2 transform -translate-x-1/2 text-red-500 text-7xl cursor-pointer hover:scale-110 transition animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          onClick={() => scrollToSection("books")}
        >
          ↑
        </div>
      </div>

      <div
        id="recipes"
        className="h-screen flex items-center justify-center bg-center bg-cover relative"
        style={{
          backgroundImage: "url('/recipes-background.jpg')",
        }}
      >
        <div className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full border border-gray-200">
          <h2 className="text-5xl font-bold text-highlight mb-4 drop-shadow-md">
            Marta&apos;s Recipes
          </h2>
          <p className="text-gray-700 text-lg italic mb-6 hover:text-olive transition">
            Delicious recipes for every taste.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/recipes"
              className="px-6 py-3 bg-accent text-highlight border-2 border-highlight rounded-full shadow-lg hover:shadow-xl hover:bg-highlight hover:text-olive transition transform hover:scale-105"
            >
              Explore Recipes
            </Link>
          </div>
        </div>
        <div
          className="absolute top-10 left-1/2 transform -translate-x-1/2 text-red-500 text-7xl cursor-pointer hover:scale-110 transition animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          onClick={() => scrollToSection("movies")}
        >
          ↑
        </div>
      </div>
    </div>
  );
}
