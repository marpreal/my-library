export type Book = {
  id: number;
  title: string;
  author: string;
  date: string;
  imageUrl?: string;
  description?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
};

export type Review = {
  id: number;
  review: string;
  rating: number;
};

export type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
};
