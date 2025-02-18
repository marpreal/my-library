type SaveMovieResponse = {
  id: number;
  title: string;
  director: string;
  releaseDate: string;
  viewedDate: string;
  imageUrl: string;
  userId: string;
};

type OMDbMovie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

export const saveMovie = async (
  movie: {
    id?: number;
    title: string;
    director?: string;
    releaseDate?: string;
    imageUrl?: string;
    viewedDate: string;
    userId: string;
  },
  movieId?: string
): Promise<SaveMovieResponse> => {
  if (!movieId) {
    throw new Error("🚨 Missing movie ID for update.");
  }

  const method = movieId ? "PATCH" : "POST";
  const url = movieId ? `/api/movies/${movieId}` : "/api/movies";

  const formattedMovie = {
    ...movie,
    viewedDate: new Date(movie.viewedDate).toISOString(),
    releaseDate: movie.releaseDate
      ? new Date(movie.releaseDate).toISOString()
      : null,
  };

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedMovie),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unknown error");
  }

  return data;
};

export const searchMovies = async (query: string): Promise<OMDbMovie[]> => {
  const cleanQuery = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .trim();

  const response = await fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(cleanQuery)}&apikey=thewdb`
  );

  if (!response.ok) {
    throw new Error("Error fetching movies");
  }

  const data = (await response.json()) as {
    Response: string;
    Search?: OMDbMovie[];
  };

  if (data.Response === "False" || !data.Search) {
    return [];
  }

  const uniqueResults = Array.from(
    new Map<string, OMDbMovie>(
      data.Search.map((movie) => [movie.imdbID, movie])
    ).values()
  );

  return uniqueResults.map((movie) => ({
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Poster: movie.Poster,
  }));
};
