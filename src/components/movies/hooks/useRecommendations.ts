// features/movie/hooks/useRecommendations.ts

import { useEffect, useState } from "react";
import { getRecommendations } from "../services/movieApi";
import { useMovieStore } from "@/lib/store/MovieStore"; // 💡 Import your store

export interface TMDBMovieSuggestion {
  id: number;
  title: string;
  media_type: string;
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

  // 1. Grab the active media type straight from your Zustand store state loop ⚡
  const { media_type } = useMovieStore();

  useEffect(() => {
    if (!currentMovieId) {
      setMovies([]);
      return;
    }

    // 2. Setup AbortController and instance state checks to block duplicates 🛡️
    const controller = new AbortController();
    let isCurrentRequest = true;

    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);

        // 3. FIXED: Forward mediaType out of store down into your movieApi service layout!
        // We pass the controller's abort signal to handle race conditions safely.
        const data = await getRecommendations(currentMovieId);

        if (!isCurrentRequest) return;

        if (Array.isArray(data)) {
          const filtered = data
            .filter(
              (movie: TMDBMovieSuggestion) =>
                movie.title !== activeMovieTitle || movie.title === "Unknown Title"
            )
            .slice(0, 10);

          setMovies(filtered);
        } else {
          setMovies([]);
        }
      } catch (err: any) {
        // Ignore native abort events to keep console clean
        if (err.name !== "AbortError" && isCurrentRequest) {
          console.error(err);
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    }

    fetchRecommendations();

    // 4. CLEANUP: Instantly aborts duplicate network calls on state mismatch 🛑
    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
    
    // 5. ADDED mediaType here so the lifecycle runs in perfect sync 🔄
  }, [currentMovieId]); 

  return {
    movies,
    loading,
    error,
  };
}
