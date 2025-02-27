import { NutritionalValue, Recipe } from "../recipe.types";

export async function handleRecipeSubmit({
  e,
  title,
  category,
  description,
  ingredients,
  nutritionalValues,
  userId,
  isPublic,
  imageFile,
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
  imageFile?: File;
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

  let imageUrl = recipeToEdit?.imageUrl;

  if (imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch("/api/upload-recipe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload image");

      imageUrl = data.imageUrl;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      alert("❌ Failed to upload image.");
      return;
    }
  }

  const cleanedNutritionalValues: NutritionalValue[] = (
    Array.isArray(nutritionalValues) ? nutritionalValues : [nutritionalValues]
  ).map((value) => ({
    calories: value.calories || 0,
    protein: value.protein || 0,
    carbs: value.carbs || 0,
    fats: value.fats || 0,
    fiber: value.fiber !== undefined ? value.fiber : undefined,
    sugar: value.sugar !== undefined ? value.sugar : undefined,
    sodium: value.sodium !== undefined ? value.sodium : undefined,
  }));

  const payload: Omit<Recipe, "id" | "user" | "comments"> = {
    title,
    category,
    description,
    ingredients,
    nutritionalValues: cleanedNutritionalValues,
    userId,
    isPublic,
    imageUrl,
    ratings: isPublic && !recipeToEdit ? [] : [],
    averageRating:
      isPublic && !recipeToEdit ? 0 : recipeToEdit?.averageRating ?? 0,
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
