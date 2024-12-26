export type Book = {
  id: number;
  title: string;
  author: string;
  date: string;
  imageUrl?: string;
};

export type Review = {
  id: number;
  review: string;
  rating: number;
};
