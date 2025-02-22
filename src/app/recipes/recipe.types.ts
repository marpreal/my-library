export type NutritionalValue = {
  id?: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name?: string;
  };
};

export type Recipe = {
  id?: number;
  title: string;
  category: string;
  description?: string;
  ingredients: string[];
  userId: string;
  isPublic: boolean;
  nutritionalValues?: NutritionalValue[];
  comments?: Comment[]; 
};
