// features/movie/hooks/useRecommendations.ts

import { useEffect, useState } from "react";
import { getRecommendations } from "../services/movieApi";

export interface TMDBMovieSuggestion {
  id: number;
  title: string;
  release_year: string;
  poster_path: string | null;
  rating: number;
}

export function useRecommendations(
  currentMovieId: string,
  activeMovieTitle?: string
) {
  const [movies, setMovies] = useState<TMDBMovieSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentMovieId) {
      setMovies([]);
      return;
    }

    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);

        const data = await getRecommendations(currentMovieId);

        if (Array.isArray(data)) {
          const filtered = data
            .filter(
              (movie: TMDBMovieSuggestion) =>
                movie.title !== activeMovieTitle
            )
            .slice(0, 10);

          setMovies(filtered);
        } else {
          setMovies([]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [currentMovieId, activeMovieTitle]);

  return {
    movies,
    loading,
    error,
  };
}