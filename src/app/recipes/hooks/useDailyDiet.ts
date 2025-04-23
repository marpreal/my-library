import { useCallback, useEffect, useState } from "react";
import { format, addWeeks, startOfWeek } from "date-fns";

export interface Meal {
  type: string;
  recipe?: {
    title: string;
  };
  notes?: string;
}

export interface DailyDiet {
  date: string;
  meals: Meal[];
}

export function useDailyDiet() {
  const [diets, setDiets] = useState<Record<string, Meal[]>>({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const startOfTargetWeek = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });

  const fetchWeeklyDiet = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/daily-diet");
      if (!res.ok) throw new Error("Failed to load diet");
      const data: DailyDiet[] = await res.json();
      const grouped = data.reduce((acc: Record<string, Meal[]>, entry) => {
        const dateKey = format(new Date(entry.date), "yyyy-MM-dd");
        acc[dateKey] = entry.meals;
        return acc;
      }, {});
      setDiets(grouped);
    } catch (err) {
      console.error("❌ Error loading daily diets:", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeeklyDiet();
  }, [fetchWeeklyDiet]);

  const goToPreviousWeek = () => setWeekOffset((prev) => prev - 1);
  const goToNextWeek = () => setWeekOffset((prev) => prev + 1);

  return {
    diets,
    startOfTargetWeek,
    loading,
    weekOffset,
    goToPreviousWeek,
    goToNextWeek,
  };
}
