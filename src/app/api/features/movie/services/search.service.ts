
/**
 * Handles live autocompletion searches using /search/multi
 */
// src/app/api/features/movie/reccomendations/route.ts

import { TMDB_BASE_URL } from "../constants/tmbd";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { filterAndFormatMovies } from "../utils/filterAndFormatMovies";

export async function searchMovies(query: string, headers: HeadersInit, media_type = "movie") {
  const url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query.trim())}&include_adult=false&language=en-US&page=1`;
  const data = await fetchWithRetry(url, headers);

  // FIX: Force the layout parser to look at the individual item content, 
  // NOT the top-level global gateway parameter string! 👇
  return filterAndFormatMovies(data.results, 8, false, "multi");
}
