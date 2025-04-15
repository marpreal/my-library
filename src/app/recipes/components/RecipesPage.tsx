"use client";

import { useRouter } from "next/navigation";
import RecipeModal from "../components/RecipeModal";
import { useRecipes } from "../hooks/useRecipes";
import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMemo } from "react";
import { useUserAndTheme } from "@/app/hooks/useUserAndTheme";
import Navbar from "@/app/components/Navbar";

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

  const { userName, theme, toggleTheme, handleSignIn, handleSignOut } =
    useUserAndTheme();

  const router = useRouter();
  const sortedPublicRecipes = useMemo(() => {
    return [...publicRecipes]
      .filter((r) => (r.averageRating ?? 0) > 0)
      .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
      .concat(publicRecipes.filter((r) => !r.averageRating));
  }, [publicRecipes]);

  const displayedRecipes = useMemo(() => {
    if (sortedPublicRecipes.length < 3) {
      return sortedPublicRecipes;
    }
    return sortedPublicRecipes;
  }, [sortedPublicRecipes]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <>
      <Navbar
        userName={userName}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        theme={theme ?? "light"}
        toggleTheme={toggleTheme}
      />
      <div className="min-h-screen flex flex-col items-center pt-24 pb-10 relative bg-cover bg-center before:absolute before:inset-0 before:bg-[url('/sweets-details.jpg')] before:bg-cover before:bg-center before:opacity-80 before:z-[-1] before:backdrop-blur-sm">
        <div className="absolute top-20 left-4 z-50">
          <button
            onClick={() => router.push("/recipes")}
            className="px-4 py-2 bg-[#DAA520] text-white rounded-lg shadow-md border border-gray-300 hover:bg-[#B8860B] transition transform hover:scale-105"
          >
            ← Back to Recipes Menu
          </button>
        </div>

        <div className="absolute top-28 right-10 z-10">
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white rounded-lg shadow-lg hover:scale-105 transition text-lg font-semibold"
          >
            + Add Recipe
          </button>
        </div>

        <h1 className="text-4xl font-bold text-[#fff] mb-10 px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-[#83511e] to-[#a56c3f] text-center text-shadow-md">
          {category} Recipes
        </h1>
        {isLoading ? (
          <div className="flex flex-col gap-6 w-full max-w-4xl px-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-6 rounded-lg border border-gray-300 bg-white shadow animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-gray-300 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
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
                      className="block bg-white shadow-md rounded-lg p-6 border border-gray-300 hover:bg-gray-100 transition cursor-pointer relative flex items-center gap-4"
                    >
                      {recipe.imageUrl && (
                        <Image
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          width={60}
                          height={60}
                          className="w-16 h-16 object-cover rounded-md border border-gray-300 shadow-sm"
                        />
                      )}

                      <h2 className="text-2xl font-bold text-[#83511e] flex-1 truncate">
                        {recipe.title}
                      </h2>

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

            {sortedPublicRecipes.length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-white mt-10 mb-4 text-center bg-gradient-to-r from-[#83511e] to-[#a56c3f] px-6 py-3 rounded-md text-shadow-md">
                  Community Recipes
                </h2>

                <div className="w-full max-w-6xl">
                  {displayedRecipes.length >= 3 ? (
                    <Slider {...sliderSettings}>
                      {displayedRecipes.map((recipe) => (
                        <div key={recipe.id} className="px-2">
                          <Link
                            href={`/recipes/${recipe.id}`}
                            className="block bg-white shadow-md rounded-lg p-6 border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                          >
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
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="flex justify-center gap-6 flex-wrap">
                      {displayedRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="px-4 py-6 w-80 bg-white shadow-lg rounded-lg border border-gray-400"
                        >
                          <Link
                            href={`/recipes/${recipe.id}`}
                            className="block hover:bg-gray-100 transition cursor-pointer"
                          >
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
                        </div>
                      ))}
                    </div>
                  )}
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

        {isModalOpen && (
          <RecipeModal
            onClose={closeModal}
            onRecipeAdded={handleRecipeAdded}
            recipeToEdit={selectedRecipe ?? null}
            preselectedCategory={category}
          />
        )}
      </div>
    </>
  );
}
