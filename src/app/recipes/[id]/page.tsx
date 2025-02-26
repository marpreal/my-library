"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Recipe } from "../recipe.types";
import CommentSection from "./components/CommentSection";
import StarRating from "../components/StarRating";
import { use } from "react";

export default function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const recipeId = Number(id);
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    if (!recipeId) return;

    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const userId = session?.user?.id ?? "";

        const response = await fetch(
          `/api/recipes?id=${recipeId}&userId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch recipe");

        const data: Recipe = await response.json();
        setRecipe({ ...data, comments: data.comments ?? [] });
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, session]);

  const hasValidNutritionalValues = recipe?.nutritionalValues?.some((nv) =>
    Object.entries(nv).some(
      ([key, value]) => key !== "id" && value !== 0 && value !== undefined
    )
  );
  const handleRatingSubmit = async (value: number) => {
    if (!session?.user) {
      alert("You must be logged in to rate a recipe.");
      return;
    }

    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId, userId: session.user.id, value }),
    });

    setRecipe((prev) =>
      prev
        ? {
            ...prev,
            averageRating:
              ((prev.averageRating ?? 0) * (prev.ratings?.length ?? 0) +
                value) /
              ((prev.ratings?.length ?? 0) + 1),
            ratings: [
              ...(prev.ratings ?? []),
              {
                id: Date.now(),
                value,
                userId: session.user.id,
                recipeId,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : prev
    );
  };

  if (isLoading)
    return <p className="text-center text-xl">Loading recipe...</p>;
  if (!recipe)
    return (
      <p className="text-center text-xl text-red-500">Recipe not found.</p>
    );

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-6 sm:px-12 bg-[#fff5e6]">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-[#DAA520] text-white rounded-lg shadow-md hover:bg-[#B8860B] transition font-semibold"
      >
        ← Back
      </button>
      <h1 className="text-4xl font-bold text-[#83511e] mb-6">{recipe.title}</h1>

      <div className="flex flex-col items-center gap-1">
        <span className="text-gray-600 text-lg">Average Rating</span>
        <div className="flex items-center gap-2">
          <StarRating rating={recipe.averageRating} />
          <span className="text-lg text-gray-700">
            {recipe.averageRating.toFixed(1)}
          </span>
        </div>
      </div>

      {session?.user && (
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="text-gray-600 text-lg">Your Rating</span>
          <StarRating rating={0} onRate={handleRatingSubmit} />
        </div>
      )}

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 border border-gray-300 mb-10">
        <h2 className="text-2xl font-semibold text-[#83511e] mb-4">
          Ingredients
        </h2>
        <ul className="space-y-3">
          {recipe.ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="text-lg text-gray-700 flex items-center gap-2"
            >
              <span className="text-[#DAA520] font-semibold">•</span>{" "}
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
      {recipe.description && (
        <p className="text-lg text-gray-700 mb-12 leading-relaxed text-center max-w-2xl">
          {recipe.description.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
      )}
      {hasValidNutritionalValues && (
        <div className="mt-8 w-full max-w-sm bg-white shadow-md rounded-lg p-4 border border-gray-300">
          <h2 className="text-xl font-semibold text-[#83511e] mb-2 text-center">
            Nutritional Information
          </h2>
          <div className="grid grid-cols-2 gap-2 text-gray-700 text-md">
            {recipe?.nutritionalValues?.map((value, index) => (
              <div
                key={index}
                className="bg-[#fff8e1] p-3 rounded-md shadow-sm text-center"
              >
                {value.calories !== 0 && (
                  <p>
                    <strong>Calories:</strong> {value.calories} kcal
                  </p>
                )}
                {value.protein !== 0 && (
                  <p>
                    <strong>Protein:</strong> {value.protein} g
                  </p>
                )}
                {value.carbs !== 0 && (
                  <p>
                    <strong>Carbs:</strong> {value.carbs} g
                  </p>
                )}
                {value.fats !== 0 && (
                  <p>
                    <strong>Fats:</strong> {value.fats} g
                  </p>
                )}
                {value.fiber !== undefined && value.fiber !== 0 && (
                  <p>
                    <strong>Fiber:</strong> {value.fiber} g
                  </p>
                )}
                {value.sugar !== undefined && value.sugar !== 0 && (
                  <p>
                    <strong>Sugar:</strong> {value.sugar} g
                  </p>
                )}
                {value.sodium !== undefined && value.sodium !== 0 && (
                  <p>
                    <strong>Sodium:</strong> {value.sodium} mg
                  </p>
                )}
              </div>
            )) ?? []}
          </div>
        </div>
      )}

      {recipe.isPublic && (
        <CommentSection recipeId={recipeId} comments={recipe.comments ?? []} />
      )}
    </div>
  );
}
