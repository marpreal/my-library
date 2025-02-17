"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Recipe = {
  id: number;
  title: string;
  description?: string;
  ingredients: string[];
};

export default function SaltDishesPage() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchRecipes = async () => {
      try {
        setIsLoading(true);

        const userId = session.user.id;
        const response = await fetch(
          `/api/recipes?category=Salt%20Dishes&userId=${userId}`
        );

        if (!response.ok) throw new Error("Failed to fetch recipes");

        const data: Recipe[] = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <div>Please log in to view recipes.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[#fff5e6] relative">
      {/* ✅ Back to Recipes Page Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => router.push("/recipes")}
          className="px-4 py-2 bg-[#DAA520] text-white rounded-lg shadow-md border border-gray-300 hover:bg-[#B8860B] transition transform hover:scale-105"
        >
          ← Back to Recipes
        </button>
      </div>

      <h1 className="text-4xl font-bold text-[#83511e] mb-10">
        Salt Dishes Recipes
      </h1>

      {isLoading ? (
        <p className="text-xl text-gray-600">Loading recipes...</p>
      ) : recipes.length > 0 ? (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-300 cursor-pointer"
              onClick={() => router.push(`/recipes/${recipe.id}`)}
            >
              <h2 className="text-2xl font-bold text-[#83511e] mb-2">
                {recipe.title}
              </h2>
              {recipe.description && (
                <ul className="text-gray-700 mb-4 list-disc list-inside">
                  {recipe.description.split("\n").map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-gray-600">No salt dishes found.</p>
      )}
    </div>
  );
}
