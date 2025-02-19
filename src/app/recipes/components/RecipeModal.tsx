"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { handleRecipeSubmit } from "../utils/handleRecipeSubmit";

type Recipe = {
  id?: number;
  title: string;
  category: string;
  description?: string;
  ingredients: string[];
  userId: string;
};

export default function RecipeModal({
  onClose,
  onRecipeAdded,
  onRecipeDeleted,
  recipeToEdit = null,
  preselectedCategory = "",
}: {
  onClose: () => void;
  onRecipeAdded: (recipe: Recipe) => void;
  onRecipeDeleted: (id: number) => void;
  recipeToEdit?: Recipe | null;
  preselectedCategory?: string;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(
    recipeToEdit?.category ?? preselectedCategory ?? "Sweets"
  );
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setCategory(recipeToEdit.category);
      setDescription(recipeToEdit.description || "");
      setIngredients(recipeToEdit.ingredients || [""]);
    } else {
      setCategory(preselectedCategory);
    }
  }, [recipeToEdit, preselectedCategory]);

  const handleDelete = async () => {
    if (!recipeToEdit?.id) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/recipes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recipeToEdit.id, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      onRecipeDeleted(recipeToEdit.id);
      onClose();
    } catch (error) {
      console.error("❌ Error deleting recipe:", error);
      alert("Error deleting recipe.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full border border-[rgba(224,178,26,0.7)] backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#83511e]">
          {recipeToEdit ? "Edit Recipe" : "Add a New Recipe"}
        </h2>

        <form
          onSubmit={(e) =>
            handleRecipeSubmit({
              e,
              title,
              category,
              description,
              ingredients,
              userId,
              recipeToEdit,
              onRecipeAdded,
              onClose,
            })
          }
          className="flex flex-col gap-6"
        >
          <input
            type="text"
            placeholder="Recipe Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300"
            disabled={!!recipeToEdit}
          >
            <option value="">Select Category</option>
            <option value="Sweets">Sweets</option>
            <option value="Salt Dishes">Salt Dishes</option>
            <option value="Snacks">Snacks</option>
          </select>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300"
          />

          <div className="flex flex-col gap-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={(e) =>
                    setIngredients((prev) =>
                      prev.map((item, i) =>
                        i === index ? e.target.value : item
                      )
                    )
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DAA520]"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIngredients([...ingredients, ""])}
              className="px-4 py-2 bg-[#DAA520] text-white rounded-lg shadow-md hover:scale-105 transition"
            >
              + Add Ingredient
            </button>
          </div>

          <div className="flex justify-between gap-4 mt-4">
            {recipeToEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className={`px-5 py-2 bg-red-500 text-white rounded-lg shadow-md ${
                  isDeleting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#DAA520] text-white rounded-lg shadow-md"
              >
                {recipeToEdit ? "Save Changes" : "Add Recipe"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
