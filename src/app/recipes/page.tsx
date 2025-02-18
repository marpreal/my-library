"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RecipeModal from "./components/RecipeModal";
import { CategoryCard } from "./components/CategoryCard";

export default function RecipesPage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You must be logged in to view recipes.</div>;
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
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

      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gold text-highlight rounded-lg shadow-md border border-highlight hover:bg-highlight hover:text-golden transition transform hover:scale-105"
          style={{ backgroundColor: "var(--gold)", color: "white" }}
        >
          Back to Menu
        </button>
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-extrabold text-[#f7e7c3] drop-shadow-lg tracking-wide mb-12">
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
  );
}
