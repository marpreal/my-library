"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function AuthDropdown({
  userName,
  handleSignIn,
  handleSignOut,
  theme,
}: {
  userName: string;
  handleSignIn: () => void;
  handleSignOut: () => void;
  theme: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <UserCircleIcon
          className={`w-10 h-10 transition ${
            theme === "dark" ? "text-white hover:text-gray-300" : "text-gray-900 hover:text-gray-700"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 shadow-lg rounded-lg py-2 transition ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          {userName !== "Your" ? (
            <>
              <Link
                href="/profile"
                className={`block px-4 py-2 transition ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className={`block w-full text-left px-4 py-2 transition ${
                  theme === "dark" ? "text-red-400 hover:bg-gray-700" : "text-red-600 hover:bg-gray-100"
                }`}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignIn}
              className={`block w-full text-left px-4 py-2 transition ${
                theme === "dark" ? "text-blue-400 hover:bg-gray-700" : "text-blue-600 hover:bg-gray-100"
              }`}
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </div>
  );
}
