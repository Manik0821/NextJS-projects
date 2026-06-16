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
  } = useMovieStore();

  // ==========================================
  // Search dropdown selection
  // ==========================================
  // REMOVED: Truncated the unused second param that was arriving undefined 👇
  const handleDropdownSelect = (value: string) => {
    const selectedOption = apiOptions.find(
      (option) => option.value === value
    );

    if (!selectedOption) return;

    // FIXED: Extract the media type straight out of the matched option item! ⚡
    // We access 'media_type' (camelCase) to perfectly match your movieApi.ts payload map.
    const resolvedMediaType = selectedOption.media_type || "movie";
    UpdateMovie(selectedOption.label,value,selectedOption.year, resolvedMediaType);
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

    const nextYear = String(
      moviePayload.release_year || moviePayload.year
    );

    // FIXED: Default safely to "movie" if the card is missing a property key
    const nextMediaType = String(
      moviePayload.media_type || "movie"
    );
    console.log(moviePayload);
    UpdateMovie(nextTitle,nextId,nextYear, nextMediaType);

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
