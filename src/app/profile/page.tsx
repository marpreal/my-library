"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, update } = useSession(); // Add update function
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error fetching profile:", data.error);
          } else {
            setName(data.name || "");
            setBio(data.bio || "");
            setLocation(data.location || "");
            setTheme(data.theme || "");
            setFavoriteGenre(data.favoriteGenre || "");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load user data:", error);
          setLoading(false);
        });
    }
  }, [session?.user?.email]);
console.log(name)
  const handleUpdateProfile = async () => {
    const response = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify({ name, bio, location, theme, favoriteGenre }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Profile updated successfully!");

      // 🔹 Refresh NextAuth session so the updated name appears immediately
      await update();
    } else {
      alert("Failed to update profile.");
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Please sign in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }
console.log(session.user.name)
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg mt-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile</h1>
      <p className="text-gray-600">Welcome, {session.user?.name}</p>

      <div className="mt-4">
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Bio</label>
        <textarea
          className="w-full border p-2 rounded-md"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Location</label>
        <input
          type="text"
          className="w-full border p-2 rounded-md"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Favorite Genre</label>
        <input
          type="text"
          className="w-full border p-2 rounded-md"
          value={favoriteGenre}
          onChange={(e) => setFavoriteGenre(e.target.value)}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handleUpdateProfile}>
          Save Changes
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={() => router.push("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
