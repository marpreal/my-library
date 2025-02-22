export type NutritionalValue = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
};

export type Recipe = {
  id?: number;
  title: string;
  category: string;
  description?: string;
  ingredients: string[];
  userId: string;
  nutritionalValues?: NutritionalValue[];
};
