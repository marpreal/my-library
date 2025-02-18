"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const TypedText = dynamic(() => import("./components/TypedText"), {
  ssr: false,
});

export default function Home() {
  const { data: session } = useSession();
  const userName = session?.user.name || "Your";
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
          <div className="ml-auto flex items-center gap-4">
            {session && (
              <Link
                href="/profile"
                className="text-lg font-semibold text-white hover:text-gold-500"
              >
                Profile
              </Link>
            )}
            {session ? (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Sign Out ({session.user?.name})
              </button>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </nav>

      <div
        id="books"
        className="h-screen flex items-center justify-center bg-center bg-cover relative"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full border border-gray-200">
          <h1 className="text-5xl font-bold text-highlight mb-4 drop-shadow-md">
            <TypedText text={`${userName}'s Library`} delay={60} loop={false} />
          </h1>

          <div className="text-gray-700 text-lg italic mb-6 hover:text-olive transition">
            <TypedText text="Like BookReads but better." delay={40} />
          </div>

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
        style={{ backgroundImage: "url('/movies-background.jpg')" }}
      >
        <div className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full border border-gray-200">
          <h2 className="text-5xl font-bold text-highlight mb-4 drop-shadow-md">
            <TypedText
              text={`${userName}'s Movie Collection"`}
              delay={60}
              loop={false}
            />
          </h2>
          <div className="text-gray-700 text-lg italic mb-6 hover:text-olive transition">
            <TypedText text="A curated list of must-watch movies." delay={40} />
          </div>
          <div className="flex justify-center gap-6">
            <Link
              href="/movies"
              className="px-6 py-3 bg-accent text-highlight border-2 border-highlight rounded-full shadow-lg hover:shadow-xl hover:bg-highlight hover:text-olive transition transform hover:scale-105"
            >
              Explore Movies
            </Link>
          </div>
        </div>
      </div>
      <div
        id="recipes"
        className="h-screen flex items-center justify-center bg-center bg-cover relative"
        style={{ backgroundImage: "url('/recipes-background.jpg')" }}
      >
        <div className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full border border-gray-200">
          <h2 className="text-5xl font-bold text-highlight mb-4 drop-shadow-md">
            <TypedText text={`${userName}'s Recipes`} delay={60} loop={false} />
          </h2>
          <div className="text-gray-700 text-lg italic mb-6 hover:text-olive transition">
            <TypedText text="Delicious recipes for every taste." delay={40} />
          </div>
          <div className="flex justify-center gap-6">
            <Link
              href="/recipes"
              className="px-6 py-3 bg-accent text-highlight border-2 border-highlight rounded-full shadow-lg hover:shadow-xl hover:bg-highlight hover:text-olive transition transform hover:scale-105"
            >
              Explore Recipes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
