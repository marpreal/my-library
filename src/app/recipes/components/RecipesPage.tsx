"use client";

import { useRouter } from "next/navigation";
import RecipeModal from "../components/RecipeModal";
import { useRecipes } from "../hooks/useRecipes";

export default function RecipesPage({ category }: { category: string }) {
  const {
    recipes,
    isLoading,
    isModalOpen,
    selectedRecipe,
    openModal,
    closeModal,
    handleRecipeAdded,
    handleDelete,
  } = useRecipes(category);

  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[#fff5e6] relative">
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => router.push("/recipes")}
          className="px-4 py-2 bg-[#DAA520] text-white rounded-lg shadow-md border border-gray-300 hover:bg-[#B8860B] transition transform hover:scale-105"
        >
          ← Back to Recipes
        </button>
      </div>

      <h1 className="text-4xl font-bold text-[#83511e] mb-10">
        {category} Recipes
      </h1>

      {isLoading ? (
        <p className="text-xl text-gray-600">Loading recipes...</p>
      ) : recipes.length > 0 ? (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-300 flex justify-between items-center"
            >
              <div>
                <h2 className="text-2xl font-bold text-[#83511e] mb-2">
                  {recipe.title}
                </h2>
                {recipe.description && (
                  <p className="text-gray-700">{recipe.description}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                {/* Edit button */}
                <button
                  onClick={() => openModal(recipe)}
                  className="text-blue-500 text-2xl hover:text-blue-700 transition"
                >
                  ✏️
                </button>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="text-red-500 text-2xl hover:text-red-700 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-gray-600">
          No {category.toLowerCase()} recipes found.
        </p>
      )}

      <div className="mt-10">
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white rounded-lg shadow-lg hover:scale-105 transition text-lg font-semibold"
        >
          + Add {category} Recipe
        </button>
      </div>

      {isModalOpen && (
        <RecipeModal
          onClose={closeModal}
          onRecipeAdded={handleRecipeAdded}
          onRecipeDeleted={handleDelete}
          recipeToEdit={selectedRecipe ?? null}
          preselectedCategory={category}
        />
      )}
    </div>
  );
}
