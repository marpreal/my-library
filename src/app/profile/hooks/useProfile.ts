import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useProfile(update: () => void) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
            setImage(data.image || "/default-avatar.png");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load user data:", error);
          setLoading(false);
        });
    }
  }, [session?.user?.email]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setImage(data.imageUrl);
      await update();
    } else {
      alert("Failed to upload image.");
    }

    setUploading(false);
  };

  const handleUpdateProfile = async () => {
    const response = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify({ name, bio, location, favoriteGenre, image }),
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
    image,
    loading,
    uploading,
    setName,
    setBio,
    setLocation,
    setFavoriteGenre,
    handleUpdateProfile,
    handleImageUpload,
  };
}
