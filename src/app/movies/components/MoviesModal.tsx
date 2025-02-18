import { useState, useEffect } from "react";
import { Movie, SearchMovie } from "../types";
import Image from "next/image";
import { searchMovies } from "../../api/movies/movies";
import { validateAndFormatDate } from "../utils";
import { useSession } from "next-auth/react";

export default function MoviesModal({
  onClose,
  onMovieAdded,
  movieToEdit,
}: {
  onClose: () => void;
  onMovieAdded: () => void;
  movieToEdit?: Movie | null;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [searchResults, setSearchResults] = useState<SearchMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewedDate, setViewedDate] = useState("");

  useEffect(() => {
    if (movieToEdit) {
      setTitle(movieToEdit.title);
      setDirector(movieToEdit.director ?? "");
      setReleaseDate(
        movieToEdit.releaseDate
          ? new Date(movieToEdit.releaseDate).toISOString().split("T")[0]
          : ""
      );
      setViewedDate(
        movieToEdit.viewedDate
          ? new Date(movieToEdit.viewedDate).toISOString().split("T")[0]
          : ""
      );
      setImageUrl(movieToEdit.imageUrl || "");
    }
  }, [movieToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!viewedDate || isNaN(new Date(viewedDate).getTime())) {
      alert("❌ Please provide a valid viewed date in YYYY-MM-DD format.");
      return;
    }

    if (!userId) {
      alert("❌ User ID is missing. Please log in.");
      console.error("❌ userId is undefined or null");
      return;
    }

    const formattedViewedDate = new Date(viewedDate).toISOString();
    const formattedReleaseDate = releaseDate
      ? new Date(releaseDate).toISOString()
      : null;

    const payload = {
      title,
      director: director || "Unknown Director",
      releaseDate: formattedReleaseDate,
      imageUrl,
      viewedDate: formattedViewedDate,
      userId,
    };

    try {
      const method = movieToEdit ? "PATCH" : "POST";
      const url = movieToEdit
        ? `/api/movies?id=${movieToEdit.id}`
        : "/api/movies"; 

      console.log("🚀 Submitting Payload:", payload);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${movieToEdit ? "update" : "save"} movie.`);
      }

      console.log("✅ Movie successfully saved!");
      onMovieAdded();
      onClose();
    } catch (error) {
      console.error("❌ Error saving movie:", error);
      alert("Error saving movie");
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      alert("Please enter a search query.");
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchMovies(query.trim());
      const uniqueResults = Array.from(
        new Map(
          results.map((movie: SearchMovie) => [movie.imdbID, movie])
        ).values()
      );

      setSearchResults(uniqueResults);
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert("Error fetching movies. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = (movie: SearchMovie) => {
    setTitle(movie.Title || "Unknown Title");
    setDirector(movie.Director || "Unknown Director");
    setReleaseDate(
      validateAndFormatDate(movie.Year ? `${movie.Year}-01-01` : undefined) ||
        ""
    );
    setImageUrl(movie.Poster || "");
    setSearchResults([]);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
      <div
        className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full border border-[rgba(224,178,26,0.7)] backdrop-blur-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{
            color: "var(--gold)",
          }}
        >
          {movieToEdit ? "Edit Movie" : "Add a New Movie"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Search for movies..."
            className="w-full p-2 border rounded"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearching && <p>Searching...</p>}
          <ul className="mt-4 max-h-40 overflow-y-auto border rounded">
            {searchResults.map((movie) => (
              <li
                key={movie.imdbID}
                className="p-2 border-b cursor-pointer hover:bg-gray-100 flex items-center"
                onClick={() => handleSelectMovie(movie)}
              >
                {movie.Poster && movie.Poster !== "N/A" ? (
                  <Image
                    src={movie.Poster}
                    alt={movie.Title || "No title available"}
                    width={50}
                    height={50}
                    className="w-12 h-12 mr-4"
                  />
                ) : (
                  <Image
                    src="https://via.placeholder.com/50"
                    alt="Placeholder"
                    width={50}
                    height={50}
                    className="w-12 h-12 mr-4"
                  />
                )}
                <div>
                  <p className="font-bold">{movie.Title}</p>
                  <p className="text-sm text-gray-600">{movie.Year}</p>
                </div>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="Movie Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg border border-[rgba(224,178,26,0.7)] focus:outline-none focus:ring-2 focus:ring-[rgba(224,178,26,0.7)] bg-white text-gray-900 shadow-md"
          />
          <input
            type="text"
            placeholder="Director (optional)"
            value={director || ""}
            onChange={(e) => setDirector(e.target.value)}
            className="px-4 py-3 rounded-lg border border-[rgba(224,178,26,0.7)] focus:outline-none focus:ring-2 focus:ring-[rgba(224,178,26,0.7)] bg-white text-gray-900 shadow-md"
          />

          <input
            type="date"
            value={releaseDate || ""}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="px-4 py-3 rounded-lg border border-[rgba(224,178,26,0.7)] focus:outline-none focus:ring-2 focus:ring-[rgba(224,178,26,0.7)] bg-white text-gray-900 shadow-md"
            placeholder="Release Date (optional)"
          />

          <input
            type="date"
            value={viewedDate}
            onChange={(e) => setViewedDate(e.target.value)}
            className="px-4 py-3 rounded-lg border border-[rgba(224,178,26,0.7)] focus:outline-none focus:ring-2 focus:ring-[rgba(224,178,26,0.7)] bg-white text-gray-900 shadow-md"
            placeholder="Date Viewed"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="px-4 py-3 rounded-lg border border-[rgba(224,178,26,0.7)] focus:outline-none focus:ring-2 focus:ring-[rgba(224,178,26,0.7)] bg-white text-gray-900 shadow-md"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[rgba(224,178,26,0.3)] text-[rgba(139,69,19,0.9)] hover:bg-[rgba(224,178,26,0.5)] transition shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[rgba(224,178,26,0.9)] text-white hover:bg-[rgba(224,178,26,1)] transition shadow-md"
            >
              {movieToEdit ? "Save Changes" : "Add Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
