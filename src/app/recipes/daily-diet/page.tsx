"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format, startOfWeek, addDays } from "date-fns";
import Navbar from "../../components/Navbar";
import { useUserAndTheme } from "../../hooks/useUserAndTheme";

const mealTypes = ["Desayuno", "Comida", "Merienda", "Cena"];

type Meal = {
  type: string;
  recipe: {
    title: string;
  };
};

type DailyDietResponse = {
  date: string;
  meals: Meal[];
}[];

export default function WeeklyDietPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userName, theme, toggleTheme, handleSignIn, handleSignOut } =
    useUserAndTheme();

  const [weeklyDiet, setWeeklyDiet] = useState<Record<string, Meal[]>>({});

  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  const fetchDiets = async () => {
    try {
      const res = await fetch("/api/daily-diet");
      if (!res.ok) throw new Error("Failed to fetch daily diet data");

      const data: DailyDietResponse = await res.json();
      const grouped = data.reduce((acc: Record<string, Meal[]>, entry) => {
        const date = format(new Date(entry.date), "yyyy-MM-dd");
        acc[date] = entry.meals;
        return acc;
      }, {});
      setWeeklyDiet(grouped);
    } catch (error) {
      console.error("❌ Error fetching diets:", (error as Error).message);
    }
  };

  useEffect(() => {
    if (session) fetchDiets();
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session)
    return <div>You must be logged in to view the diet schedule.</div>;

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-8">
      <Navbar
        userName={userName}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        theme={theme ?? "light"}
        toggleTheme={toggleTheme}
      />

      <h1 className="text-4xl font-bold text-center mb-10 text-green-900">
        Weekly Diet Schedule
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-4 border">Day</th>
              {mealTypes.map((meal) => (
                <th key={meal} className="px-6 py-4 border">
                  {meal}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, index) => {
              const date = format(
                addDays(startOfCurrentWeek, index),
                "yyyy-MM-dd"
              );
              const dayName = format(
                addDays(startOfCurrentWeek, index),
                "EEEE"
              );
              const meals = weeklyDiet[date] || [];
              const mealByType = Object.fromEntries(
                meals.map((m) => [m.type, m.recipe?.title ?? "-"])
              );

              return (
                <tr key={date} className="text-center">
                  <td className="px-4 py-2 border font-medium bg-gray-100">
                    {dayName}
                  </td>
                  {mealTypes.map((meal) => (
                    <td key={meal} className="px-4 py-2 border">
                      {mealByType[meal] || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/recipes/daily-diet/new")}
          className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 shadow-md"
        >
          ➕ Add Meals to a Day
        </button>
      </div>
    </div>
  );
}
