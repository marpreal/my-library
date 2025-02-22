"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Recipe } from "../recipe.types";
import CommentSection from "./components/CommentSection";

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
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!recipeId) return;

    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/recipes?id=${recipeId}`);
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
  }, [recipeId, status]);

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
      {recipe.nutritionalValues && recipe.nutritionalValues.length > 0 && (
        <div className="mt-8 w-full max-w-sm bg-white shadow-md rounded-lg p-4 border border-gray-300">
          <h2 className="text-xl font-semibold text-[#83511e] mb-2 text-center">
            Nutritional Information
          </h2>
          <div className="grid grid-cols-2 gap-2 text-gray-700 text-md">
            {recipe.nutritionalValues.map((value, index) => (
              <div
                key={index}
                className="bg-[#fff8e1] p-3 rounded-md shadow-sm text-center"
              >
                <p>
                  <strong>Calories:</strong> {value.calories} kcal
                </p>
                <p>
                  <strong>Protein:</strong> {value.protein} g
                </p>
                <p>
                  <strong>Carbs:</strong> {value.carbs} g
                </p>
                <p>
                  <strong>Fats:</strong> {value.fats} g
                </p>
                {value.fiber !== undefined && (
                  <p>
                    <strong>Fiber:</strong> {value.fiber} g
                  </p>
                )}
                {value.sugar !== undefined && (
                  <p>
                    <strong>Sugar:</strong> {value.sugar} g
                  </p>
                )}
                {value.sodium !== undefined && (
                  <p>
                    <strong>Sodium:</strong> {value.sodium} mg
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <CommentSection recipeId={recipeId} comments={recipe.comments ?? []} />
    </div>
  );
}
