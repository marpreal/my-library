"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Recipe } from "../recipe.types";

export function useRecipes(category: string) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchUserRecipes = async () => {
      try {
        setIsLoading(true);
        const userId = session.user.id;
        const response = await fetch(
          `/api/recipes?category=${encodeURIComponent(
            category
          )}&userId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user recipes");
        const data: Recipe[] = await response.json();

        setRecipes(data.filter((recipe) => recipe.userId === userId));
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRecipes();
  }, [session, status, router, category]);

  useEffect(() => {
    const fetchPublicRecipes = async () => {
      try {
        const response = await fetch(
          `/api/recipes?category=${encodeURIComponent(
            category
          )}&publicOnly=true`
        );

        if (!response.ok) throw new Error("Failed to fetch public recipes");
        const data: Recipe[] = await response.json();

        setPublicRecipes(data);
      } catch (error) {
        console.error("Error fetching public recipes:", error);
      }
    };

    fetchPublicRecipes();
  }, [category]);

  return {
    recipes,
    publicRecipes,
    isLoading,
    isModalOpen,
    selectedRecipe,
    openModal: (recipe: Recipe | null = null) => {
      setSelectedRecipe(recipe);
      setIsModalOpen(true);
    },
    closeModal: () => {
      setSelectedRecipe(null);
      setIsModalOpen(false);
    },

    handleRecipeAdded: (newRecipe: Recipe) => {
      setRecipes((prev) => {
        if (selectedRecipe && newRecipe.id !== undefined) {
          return prev.map((r) => (r.id === newRecipe.id ? newRecipe : r));
        } else {
          return [...prev, newRecipe];
        }
      });
    },

    handleDelete: async (id?: number) => {
      if (id === undefined) return;
      const userConfirmed = confirm(
        "Are you sure you want to delete this recipe?"
      );
      if (!userConfirmed) return;

      try {
        const response = await fetch(`/api/recipes`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, userId: session?.user?.id }),
        });

        if (!response.ok) throw new Error("Failed to delete recipe");

        setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    },
  };
}
