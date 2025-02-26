"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RecipeModal from "./components/RecipeModal";
import { CategoryCard } from "./components/CategoryCard";
import Navbar from "../components/Navbar";
import { useUserAndTheme } from "../hooks/useUserAndTheme";

export default function RecipesPage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { userName, theme, toggleTheme, handleSignIn, handleSignOut } =
    useUserAndTheme();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You must be logged in to view recipes.</div>;
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Navbar
        userName={userName}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        theme={theme ?? "light"}
        toggleTheme={toggleTheme}
      />
      <div
        className="min-h-screen flex flex-col items-center py-10 relative overflow-hidden"
        style={{
          backgroundImage: "url('/recipes-banquet-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-60 z-0"
          style={{ backdropFilter: "blur(10px)" }}
        ></div>

        <div className="relative text-center z-10 mt-12 sm:mt-16 mb-12 sm:mb-16">
          <h1
            className="text-4xl sm:text-7xl font-bold text-gold relative"
            style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)" }}
          >
            Recipes
          </h1>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-8 justify-center items-center mb-12 px-4">
          <CategoryCard
            title="Sweets"
            description="Desserts and sugary delights!"
            imageUrl="/sweets.jpg"
            onClick={() => router.push("/recipes/sweets")}
          />
          <CategoryCard
            title="Salt Dishes"
            description="Family, friends and own meals."
            imageUrl="/meals.webp"
            onClick={() => router.push("/recipes/salt-dishes")}
          />
          <CategoryCard
            title="Snacks"
            description="Little (or not) bites!"
            imageUrl="/snacks.jpg"
            onClick={() => router.push("/recipes/snacks")}
          />
        </div>

        <div className="relative z-10">
          <button
            onClick={openModal}
            className="px-8 py-4 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white rounded-lg shadow-xl hover:scale-105 transition text-lg font-semibold"
          >
            + Add Recipe
          </button>
        </div>

        {isModalOpen && (
          <RecipeModal
            onClose={closeModal}
            onRecipeAdded={(recipe) =>
              alert(`Recipe "${recipe.title}" added successfully!`)
            }
          />
        )}
      </div>
    </>
  );
}
