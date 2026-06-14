// src/features/movie/hooks/useMovieSelection.ts

"use client";

import { useMovieStore } from "@/lib/store/MovieStore";
import { MovieOption } from "@/lib/types/movie";

export function useMovieSelection(
  apiOptions: MovieOption[],
  setSearchQuery: (value: string) => void
) {
  const {
    UpdateMovie,
    UpdateMovieId,
  } = useMovieStore();

  // ==========================================
  // Search dropdown selection
  // ==========================================
  const handleDropdownSelect = (
    value: string
  ) => {
    const selectedOption = apiOptions.find(
      (option) => option.value === value
    );

    if (!selectedOption) return;

    UpdateMovieId(value);
    UpdateMovie(selectedOption.label);
  };

  // ==========================================
  // Recommendation card click
  // ==========================================
  const handleRecommendationSelect = (
    moviePayload: any
  ) => {
    const nextId = String(
      moviePayload.id || ""
    );

    const nextTitle =
      moviePayload.title || "";

    UpdateMovieId(nextId);
    UpdateMovie(nextTitle);

    setSearchQuery(nextTitle);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    handleDropdownSelect,
    handleRecommendationSelect,
  };
}