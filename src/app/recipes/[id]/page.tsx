"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Recipe = {
  id: number;
  title: string;
  category: string;
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

  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? "";

  useEffect(() => {
    if (status === "loading") return;

    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const url = userId
          ? `/api/recipes?id=${id}&userId=${userId}`
          : `/api/recipes?id=${id}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch recipe");

        const data: Recipe = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, userId, status]);

  if (isLoading) {
    return <p className="text-center text-xl">Loading recipe...</p>;
  }

  if (!recipe) {
    return (
      <p className="text-center text-xl text-red-500">Recipe not found.</p>
    );
  }

  const handleBackClick = () => {
    const categoryRoutes: Record<string, string> = {
      Sweets: "/recipes/sweets",
      "Salt Dishes": "/recipes/salt-dishes",
      Snacks: "/recipes/snacks",
    };

    router.push(categoryRoutes[recipe.category] || "/recipes");
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-6 sm:px-12 bg-[#fff5e6]">
      <button
        onClick={handleBackClick}
        className="mb-6 px-4 py-2 bg-[#DAA520] text-white rounded-lg shadow-md hover:bg-[#B8860B] transition font-semibold"
      >
        ← Back to {recipe.category}
      </button>

      <h1 className="text-4xl font-bold text-[#83511e] mb-6">{recipe.title}</h1>
      {recipe.description && (
        <p className="text-lg text-gray-700 mb-6">
          {recipe.description.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
      )}

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
