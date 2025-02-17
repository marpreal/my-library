type Recipe = {
  id?: number;
  title: string;
  category: string;
  description?: string;
  ingredients: string[];
  userId: string;
};

export function handleRecipeSubmit({
  e,
  title,
  category,
  description,
  ingredients,
  userId,
  recipeToEdit,
  onRecipeAdded,
  onClose,
}: {
  e: React.FormEvent;
  title: string;
  category: string;
  description: string;
  ingredients: string[];
  userId: string;
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

  const payload: Recipe = { title, category, description, ingredients, userId };

  fetch("/api/recipes", {
    method: recipeToEdit?.id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      recipeToEdit?.id ? { ...payload, id: recipeToEdit.id } : payload
    ),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.error || "Failed to save recipe");
        });
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
