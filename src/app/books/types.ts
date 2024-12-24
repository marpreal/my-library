export type Book = {
  id: number;
  title: string;
  author: string;
  date: string;
  imageUrl?: string;
};

export type Review = {
  review: string;
  rating: number;
};
