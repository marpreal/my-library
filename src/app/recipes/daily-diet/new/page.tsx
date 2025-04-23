"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

const mealTypes = ["Desayuno", "Comida", "Merienda", "Cena"];

interface MealForm {
  type: string;
  foodName: string;
  notes: string;
}

interface FetchedMeal {
  type: string;
  notes?: string;
  recipe?: {
    title?: string;
  };
}

interface FetchedDiet {
  id: number;
  meals: FetchedMeal[];
}

export default function NewDailyDietPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [meals, setMeals] = useState<MealForm[]>(
    mealTypes.map((type) => ({ type, foodName: "", notes: "" }))
  );
  const [existingId, setExistingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDailyDiet = async () => {
      const res = await fetch(`/api/daily-diet?date=${date}`);
      if (!res.ok) return;

      const data: FetchedDiet = await res.json();
      if (data?.id) {
        setExistingId(data.id);
        setMeals(
          data.meals.map((m) => ({
            type: m.type,
            foodName: m.recipe?.title ?? "",
            notes: m.notes ?? "",
          }))
        );
      } else {
        setExistingId(null);
        setMeals(mealTypes.map((type) => ({ type, foodName: "", notes: "" })));
      }
    };

    fetchDailyDiet();
  }, [date]);

  const handleChange = (index: number, field: keyof MealForm, value: string) => {
    setMeals((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async () => {
    const validMeals = meals.filter((m) => m.foodName.trim() !== "");
    if (validMeals.length === 0) return;

    const res = await fetch("/api/daily-diet", {
      method: existingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(existingId ? { id: existingId } : {}),
        date,
        meals: validMeals.map((m) => ({
          type: m.type,
          notes: m.notes,
          foodName: m.foodName,
        })),
      }),
    });

    if (res.ok) router.push("/recipes/daily-diet");
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>You must be logged in to add meals.</div>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-900">
        {existingId ? "Edit Daily Diet" : "Add Meals for the Day"}
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {meals.map((meal, index) => (
          <div key={meal.type} className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-green-800">{meal.type}</h2>
            <input
              type="text"
              placeholder="What are you cooking?"
              value={meal.foodName}
              onChange={(e) => handleChange(index, "foodName", e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <textarea
              placeholder="Notes (optional)"
              value={meal.notes}
              onChange={(e) => handleChange(index, "notes", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded font-semibold"
        >
          Save Daily Diet
        </button>
      </div>
    </div>
  );
}
