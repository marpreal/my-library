type SaveMovieResponse = {
  id: number;
  title: string;
  director: string;
  releaseDate: string;
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
    title: string;
    director: string;
    releaseDate: string;
    imageUrl: string;
    viewedDate: string;
    userId: string;
  },
  movieId?: string
): Promise<SaveMovieResponse> => {
  if (!movie.title || !movie.viewedDate || !movie.userId) {
    throw new Error("🚨 Missing required fields: title, date, or userId");
  }

  const method = movieId ? "PATCH" : "POST";
  const url = movieId ? `/api/movies/${movieId}` : "/api/movies";

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });

  if (!response.ok) {
    const error = (await response.json()) as { error: string };
    throw new Error(error.error || "Unknown error");
  }

  return (await response.json()) as SaveMovieResponse;
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
