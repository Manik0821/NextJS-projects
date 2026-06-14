import { useEffect, useState } from "react";
import { detailsCache } from "../cache/movieCache";
import { useMovieStore } from "@/lib/store/MovieStore";
import { fetchMovieDetails } from "../services/movieApi";

export function useMovieDetails(currMovieId: string) {
  const [movieDetails, setMovieDetails] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [canShowAISummary, setCanShowAISummary] =
    useState(false);

  const { currMovie, UpdateMovie } =
    useMovieStore();

  useEffect(() => {
    if (!currMovieId) {
      setMovieDetails(null);
      setCanShowAISummary(false);
      return;
    }

    let isCurrentRequest = true;

    async function getMovieDetails() {
      // Cache lookup
      if (detailsCache[currMovieId]) {
        const cachedData =
          detailsCache[currMovieId];

        setMovieDetails(cachedData);

        if (
          cachedData.title &&
          currMovie !== cachedData.title
        ) {
          UpdateMovie(cachedData.title);
        }

        setCanShowAISummary(true);

        return;
      }

      try {
        setLoading(true);
        setError(null);
        setCanShowAISummary(false);

        const data = await fetchMovieDetails(
            currMovieId
          );

        if (!isCurrentRequest) return;

        detailsCache[currMovieId] = data;

        setMovieDetails(data);

        if (
          data.title &&
          currMovie !== data.title
        ) {
          UpdateMovie(data.title);
        }

        setCanShowAISummary(true);
      } catch (err: any) {
        if (isCurrentRequest) {
          setError(
            err.message || "An error occurred"
          );
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
  }, [currMovieId]);

  return {
    movieDetails,
    loading,
    error,
    canShowAISummary,
  };
}