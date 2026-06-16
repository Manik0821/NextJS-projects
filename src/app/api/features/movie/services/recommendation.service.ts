// services/recommendation.service.ts

import { fetchWithRetry } from "../utils/fetchWithRetry";
import { filterAndFormatMovies } from "../utils/filterAndFormatMovies";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function getRecommendations(
  movieId: number,
  headers: HeadersInit,
  media_type = "movie"
) {
  const endpoint = media_type === "tv" ? "tv" : "movie";

  const data = await fetchWithRetry(
    `${TMDB_BASE_URL}/${endpoint}/${movieId}/recommendations?language=en-US&page=1`,
    headers
  );

  return filterAndFormatMovies(data.results, 10);
}