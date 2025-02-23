import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useProfile(update: () => void) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
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

  const handleUpdateProfile = async () => {
    const response = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify({ name, bio, location, favoriteGenre }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Profile updated successfully!");
      await update();
    } else {
      alert("Failed to update profile.");
    }
  };

  return {
    session,
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
  };
}
