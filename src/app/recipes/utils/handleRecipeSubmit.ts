import { NutritionalValue, Recipe } from "../recipe.types";

export function handleRecipeSubmit({
  e,
  title,
  category,
  description,
  ingredients,
  nutritionalValues,
  userId,
  isPublic,
  recipeToEdit,
  onRecipeAdded,
  onClose,
}: {
  e: React.FormEvent;
  title: string;
  category: string;
  description: string;
  ingredients: string[];
  nutritionalValues: NutritionalValue | NutritionalValue[];
  userId: string;
  isPublic: boolean;
  recipeToEdit?: Recipe | null;
  onRecipeAdded: (recipe: Recipe) => void;
  onClose: () => void;
}) {
  e.preventDefault();

  if (!title || !category || ingredients.some((ing) => ing.trim() === "")) {
    alert("❌ Please fill in all required fields.");
    return;
  }

  if (!userId) {
    alert("❌ You must be logged in to add or edit a recipe.");
    console.error("❌ userId is undefined or null");
    return;
  }

  const cleanedNutritionalValues = (
    Array.isArray(nutritionalValues) ? nutritionalValues : [nutritionalValues]
  ).map((value) => ({
    calories: value.calories || 0,
    protein: value.protein || 0,
    carbs: value.carbs || 0,
    fats: value.fats || 0,
    fiber: value.fiber ?? null,
    sugar: value.sugar ?? null,
    sodium: value.sodium ?? null,
  }));

  const payload = {
    title,
    category,
    description,
    ingredients,
    nutritionalValues: cleanedNutritionalValues,
    userId,
    isPublic,
  };

  fetch("/api/recipes", {
    method: recipeToEdit?.id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      recipeToEdit?.id ? { ...payload, id: recipeToEdit.id } : payload
    ),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save recipe");
      }
      return response.json();
    })
    .then((savedRecipe: Recipe) => {
      onRecipeAdded(savedRecipe);
      onClose();
    })
    .catch((error) => {
      console.error("❌ Error saving recipe:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    });
}
