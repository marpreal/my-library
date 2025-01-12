"use client";

import { useEffect, useState } from "react";
import { use } from "react";

type Recipe = {
  id: number;
  title: string;
  description?: string;
  ingredients: string[];
};

export default function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/recipes?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch recipe");
        const data: Recipe = await response.json();
        setRecipe(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching recipe:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) {
    return <p className="text-center text-xl">Loading recipe...</p>;
  }

  if (!recipe) {
    return (
      <p className="text-center text-xl text-red-500">Recipe not found.</p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[#fff5e6]">
      <h1 className="text-4xl font-bold text-[#83511e] mb-6">{recipe.title}</h1>
      <p className="text-lg text-gray-700 mb-6">{recipe.description}</p>
      <h2 className="text-2xl font-semibold text-[#83511e] mb-4">
        Ingredients
      </h2>
      <ul className="list-decimal list-inside">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="text-lg text-gray-700">
            {ingredient}
          </li>
        ))}
      </ul>
    </div>
  );
}