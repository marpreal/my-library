"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function AuthDropdown({
  userName,
  handleSignIn,
  handleSignOut,
}: {
  userName: string;
  handleSignIn: () => void;
  handleSignOut: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <UserCircleIcon className="w-10 h-10 text-white hover:text-gold-500 transition" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
          {userName !== "Your" ? (
            <>
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignIn}
              className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </div>
  );
}
