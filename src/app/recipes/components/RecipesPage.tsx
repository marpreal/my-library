"use client";

import { useRouter } from "next/navigation";
import RecipeModal from "../components/RecipeModal";
import { useRecipes } from "../hooks/useRecipes";
import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";

export default function RecipesPage({ category }: { category: string }) {
  const {
    recipes,
    publicRecipes,
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
      ) : (
        <>
          {recipes.length > 0 && (
            <>
              <h2 className="text-3xl font-bold text-[#83511e] mb-4">
                Your Recipes
              </h2>
              <div className="flex flex-col gap-6 w-full max-w-4xl">
                {recipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="block bg-white shadow-md rounded-lg p-6 border border-gray-300 hover:bg-gray-100 transition cursor-pointer relative"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-[#83511e] mb-2">
                        {recipe.title}
                      </h2>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openModal(recipe);
                        }}
                        className="text-blue-500 text-2xl hover:text-blue-700 transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(recipe.id);
                        }}
                        className="text-red-500 text-2xl hover:text-red-700 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {publicRecipes.length > 0 && (
            <>
              <h2 className="text-3xl font-bold text-[#83511e] mt-10 mb-4">
                Community Recipes
              </h2>
              <div className="flex flex-col gap-6 w-full max-w-4xl">
                {publicRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="block bg-white shadow-md rounded-lg p-6 border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      {recipe.user?.image ? (
                        <Image
                          src={recipe.user.image}
                          alt={recipe.user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full border border-gray-300 shadow-md"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600">
                          {recipe.user?.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                      )}
                      <span className="text-lg font-semibold text-gray-800">
                        {recipe.user?.name ?? "Unknown"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-[#83511e] mb-2">
                      {recipe.title}
                    </h2>
                    <p className="text-gray-700">{recipe.category}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={recipe.averageRating ?? 0} />
                      <span className="text-lg text-gray-600">
                        {(recipe.averageRating ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {recipes.length === 0 && publicRecipes.length === 0 && (
            <p className="text-xl text-gray-600">
              No {category.toLowerCase()} recipes found.
            </p>
          )}
        </>
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
          recipeToEdit={selectedRecipe ?? null}
          preselectedCategory={category}
        />
      )}
    </div>
  );
}
