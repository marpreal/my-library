"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Recipe = {
  id?: number;
  title: string;
  category: string;
  description?: string;
  ingredients: string[];
  userId: string;
};

export function useRecipes(category: string) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

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
          `/api/recipes?category=${category}&userId=${userId}`
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
  }, [session, status, router, category]);

  const openModal = (recipe: Recipe | null = null) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  const handleRecipeAdded = (newRecipe: Recipe) => {
    setRecipes((prev) => {
      if (selectedRecipe && newRecipe.id !== undefined) {
        return prev.map((r) => (r.id === newRecipe.id ? newRecipe : r));
      } else {
        return [...prev, newRecipe];
      }
    });
    closeModal();
  };

  const handleDelete = async (id?: number) => {
    if (id === undefined) return;

    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const response = await fetch("/api/recipes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId: session?.user?.id }),
      });

      if (!response.ok) throw new Error("Failed to delete recipe");

      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return {
    recipes,
    isLoading,
    isModalOpen,
    selectedRecipe,
    openModal,
    closeModal,
    handleRecipeAdded,
    handleDelete,
  };
}
