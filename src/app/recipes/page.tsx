"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecipesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 z-0"
        style={{ backdropFilter: "blur(10px)" }}
      ></div>

      {/* Page Title */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-extrabold text-[#f7e7c3] drop-shadow-lg tracking-wide mb-12">
          Recipes
        </h1>
      </div>

      {/* Categories */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg mx-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#83511e]">
              Add Recipe
            </h2>
            <AddRecipeForm onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryCard({
  title,
  description,
  imageUrl,
  onClick,
}: {
  title: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
}) {
  return (
    <div
      className="w-full max-w-sm bg-gradient-to-b from-[#fff5e6] to-[#f7e7c3] rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition cursor-pointer"
      onClick={onClick}
    >
      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url('${imageUrl}')`,
        }}
      ></div>
      <div className="p-4 text-center">
        <h3 className="text-3xl font-bold text-[#83511e] mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function AddRecipeForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);

  const handleAddIngredient = () => setIngredients([...ingredients, ""]);
  const handleIngredientChange = (index: number, value: string) =>
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || ingredients.some((ing) => ing.trim() === "")) {
      alert("Please provide all fields!");
      return;
    }

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, description, ingredients }),
      });

      if (!response.ok) throw new Error("Failed to add recipe");

      alert("Recipe added successfully!");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding recipe:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      alert("Failed to add recipe.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
      >
        <option value="">Select Category</option>
        <option value="Sweets">Sweets</option>
        <option value="Salt Dishes">Salt Dishes</option>
        <option value="Snacks">Snacks</option>
      </select>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
      />
      <div className="flex flex-col gap-2">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder={`Ingredient ${index + 1}`}
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="px-4 py-2 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white rounded-lg shadow-md hover:scale-105 transition"
        >
          + Add Ingredient
        </button>
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white rounded-lg shadow-md hover:scale-105 transition font-sans"
      >
        Submit
      </button>
    </form>
  );
}
