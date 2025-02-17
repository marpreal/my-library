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
  recipeToEdit = null,
}: {
  onClose: () => void;
  onRecipeAdded: (recipe: Recipe) => void;
  recipeToEdit?: Recipe | null;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setCategory(recipeToEdit.category);
      setDescription(recipeToEdit.description || "");
      setIngredients(recipeToEdit.ingredients || [""]);
    }
  }, [recipeToEdit]);

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

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-300 text-gray-800"
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
        </form>
      </div>
    </div>
  );
}
