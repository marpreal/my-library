export type Movie = {
  id: number;
  title: string;
  director?: string;
  releaseDate?: string;
  viewedDate: string;
  imageUrl?: string;
  description?: string;
  genre?: string;
};

export type SearchMovie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster?: string;
  Director?: string;
};

export type Review = {
  id: number;
  movieId: number;
  review: string;
  rating: number;
  createdAt: string;
};
