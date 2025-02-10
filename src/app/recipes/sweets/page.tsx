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

export default function SweetsPage() {
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
        const response = await fetch("/api/recipes?category=Sweets");
        if (!response.ok) throw new Error("Failed to fetch recipes");
        const data: Recipe[] = await response.json();
        setRecipes(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching recipes:", error.message);
        } else {
          console.error("An unexpected error occurred:", error);
        }
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
    <div className="min-h-screen flex flex-col items-center py-10 bg-[#fff5e6]">
      <h1 className="text-4xl font-bold text-[#83511e] mb-10">
        Sweets Recipes
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
        <p className="text-xl text-gray-600">No sweet recipes found.</p>
      )}
    </div>
  );
}
