"use client";

import Link from "next/link";
import AuthButtons from "./AuthButtons";

export default function Navbar({
  activeSection,
  scrollToSection,
  userName,
  handleSignIn,
  handleSignOut,
}: {
  activeSection: string;
  scrollToSection: (id: string) => void;
  userName: string;
  handleSignIn: () => void;
  handleSignOut: () => void;
}) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-brown-800 text-gold-500 shadow-md z-50 pointer-events-auto h-16">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex gap-8">
          {["books", "movies", "recipes"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`text-lg font-semibold ${
                activeSection === section ? "text-gold-500" : "text-white"
              } transition`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {userName !== "Your" && (
            <Link href="/profile" className="text-lg font-semibold text-white hover:text-gold-500">
              {userName}&apos;s Profile
            </Link>
          )}
          <AuthButtons userName={userName} handleSignIn={handleSignIn} handleSignOut={handleSignOut} />
        </div>
      </div>
    </nav>
  );
}
