import { useEffect, useState } from "react";

export function useRecommendations(
  movieId: string,
  type: "recommendations" | "similar" | "popular",
  mediaType = "movie"
) {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);

        let url = "";

        switch (type) {
          case "recommendations":
            url =
              `/api/features/movie?recommendations=${movieId}` +
              `&media_type=${mediaType}`;
            break;

          case "similar":
            url =
              `/api/features/movie?similar=${movieId}` +
              `&media_type=${mediaType}`;
            break;

          case "popular":
            url =
              `/api/features/movie?popular=true` +
              `&media_type=${mediaType}`;
            break;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch movies"
          );
        }

        const data = await response.json();

        setMovies(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [movieId, type, mediaType]);

  return {
    movies,
    loading,
    error,
  };
}