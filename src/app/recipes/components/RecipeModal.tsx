"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { handleRecipeSubmit } from "../utils/handleRecipeSubmit";
import { NutritionalValue, Recipe } from "../recipe.types";

export default function RecipeModal({
  onClose,
  onRecipeAdded,
  recipeToEdit = null,
  preselectedCategory = "",
}: {
  onClose: () => void;
  onRecipeAdded: (recipe: Recipe) => void;
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

  const [nutritionalValues, setNutritionalValues] = useState<
    NutritionalValue[]
  >(
    recipeToEdit?.nutritionalValues?.length
      ? recipeToEdit.nutritionalValues
      : [
          {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: undefined,
            sugar: undefined,
            sodium: undefined,
          },
        ]
  );

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setCategory(recipeToEdit.category);
      setDescription(recipeToEdit.description || "");
      setIngredients(recipeToEdit.ingredients || [""]);
      setNutritionalValues(
        recipeToEdit.nutritionalValues?.length
          ? recipeToEdit.nutritionalValues
          : [
              {
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
                fiber: undefined,
                sugar: undefined,
                sodium: undefined,
              },
            ]
      );
    } else {
      setCategory(preselectedCategory);
    }
  }, [recipeToEdit, preselectedCategory]);

  const handleNutritionalValueChange = (
    index: number,
    key: keyof NutritionalValue,
    value: string
  ) => {
    setNutritionalValues((prev) =>
      prev.map((entry, i) =>
        i === index
          ? { ...entry, [key]: value ? parseFloat(value) : undefined }
          : entry
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 p-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full border border-[rgba(224,178,26,0.7)] backdrop-blur-md overflow-y-auto max-h-[90vh]">
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
              nutritionalValues,
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

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Nutritional Values</h3>

            {nutritionalValues.map((nutrition, index) => (
              <div key={index} className="flex flex-col gap-2">
                {[
                  "calories",
                  "protein",
                  "carbs",
                  "fats",
                  "fiber",
                  "sugar",
                  "sodium",
                ].map((key) => (
                  <input
                    key={key}
                    type="number"
                    placeholder={`${
                      key.charAt(0).toUpperCase() + key.slice(1)
                    } (g)`}
                    value={nutrition[key as keyof NutritionalValue] || ""}
                    onChange={(e) =>
                      handleNutritionalValueChange(
                        index,
                        key as keyof NutritionalValue,
                        e.target.value
                      )
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-4 mt-4">
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
