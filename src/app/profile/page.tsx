"use client";

import { useRouter } from "next/navigation";
import { useUserAndTheme } from "../hooks/useUserAndTheme";
import { useProfile } from "./hooks/useProfile";
import SkeletonLoader from "./components/SkeletonLoader";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { theme } = useUserAndTheme(); 
  const {
    name,
    bio,
    location,
    favoriteGenre,
    loading,
    setName,
    setBio,
    setLocation,
    setFavoriteGenre,
    handleUpdateProfile,
  } = useProfile(update);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700 dark:text-white">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen flex justify-center items-center bg-cover bg-center transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[url('/cybercore-bg.webp')] text-white"
          : "bg-[url('/cottagecore-background.jpg')] text-[#3a2f2f]"
      }`}
    >
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-500">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Welcome, {session.user?.name}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold">Bio</label>
              <textarea
                className="w-full border p-2 rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block font-semibold">Location</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold">Favorite Genre</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={handleUpdateProfile}
            >
              Save Changes
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              onClick={() => router.push("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
