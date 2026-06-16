import { useEffect, useState } from "react";
import { detailsCache } from "../cache/movieCache";
import { useMovieStore } from "@/lib/store/MovieStore";
import { fetchMovieDetails } from "../services/movieApi";

export function useMovieDetails(currMovieId: string) {
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canShowAISummary, setCanShowAISummary] = useState(false);

  // 1. EXTRACT media_type FROM YOUR STATE STORE 👇
  const { currMovie, media_type, UpdateMovie } = useMovieStore();

  useEffect(() => {
    if (!currMovieId) {
      setMovieDetails(null);
      setCanShowAISummary(false);
      return;
    }

    let isCurrentRequest = true;

    async function getMovieDetails() {
      // Create a unique cache key that combines ID and type to prevent data overlaps
      const cacheKey = `${currMovieId}_${media_type}`;

      // Cache lookup
      if (detailsCache[cacheKey]) {
        const cachedData = detailsCache[cacheKey];
        setMovieDetails(cachedData);

        if (cachedData.title && currMovie !== cachedData.title) {
          // Use cached media_type or fallback to global context state
          UpdateMovie(cachedData.title,cachedData.movieId, cachedData.release_year, cachedData.media_type || media_type);
        }

        setCanShowAISummary(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setCanShowAISummary(false);

        // 2. FORWARD media_type DOWN TO THE API CALLER 👇
        const data = await fetchMovieDetails(currMovieId, media_type);

        if (!isCurrentRequest) return;

        // Save data into structural cache tracking media variations smoothly
        detailsCache[cacheKey] = { ...data, media_type };
        setMovieDetails(data);

        if (data.title && currMovie !== data.title) {
          UpdateMovie(data.title,data.movieId,data.release_year, data.media_type);
        }

        setCanShowAISummary(true);
      } catch (err: any) {
        if (isCurrentRequest) {
          setError(err.message || "An error occurred");
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    }

    getMovieDetails();

    return () => {
      isCurrentRequest = false;
    };
    // 3. ADD media_type TO THE DEPENDENCY ARRAY SO IT RE-TRIGGERS ON SWITCHES 🔄
  }, [currMovieId, media_type]);

  return {
    movieDetails,
    loading,
    error,
    canShowAISummary,
  };
}
