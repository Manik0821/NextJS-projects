// services/movieService.ts

import { TMDB_BASE_URL } from "../constants/tmbd";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { mapSearchResults } from "../mappers/movieMapper";
import { mapMovieDetails } from "../mappers/movieDetailsMapper";

export async function searchMovies(
  query: string,
  headers: HeadersInit
) {
  const url =
    `${TMDB_BASE_URL}/search/multi?query=` +
    encodeURIComponent(query.trim()) +
    "&include_adult=false&language=en-US&page=1";

  const data =
    await fetchWithRetry(url, headers);

  return mapSearchResults(
    data.results,
    8,
    "multi"
  );
}

export async function getRecommendations(
  id: number,
  headers: HeadersInit,
  media_type = "movie"
) {
  const endpoint =
    media_type === "tv"
      ? "tv"
      : "movie";

  const url =
    `${TMDB_BASE_URL}/${endpoint}/${id}` +
    "/recommendations?language=en-US&page=1";

  const data =
    await fetchWithRetry(url, headers);

  return mapSearchResults(
    data.results,
    10,
    media_type
  );
}

export async function getMovieDetails(
  id: number,
  headers: HeadersInit,
  media_type = "movie"
) {
  const detailsUrl =
    `${TMDB_BASE_URL}/${media_type}/${id}?language=en-US`;

  const creditsUrl =
    `${TMDB_BASE_URL}/${media_type}/${id}/credits?language=en-US`;

  const details =
    await fetchWithRetry(
      detailsUrl,
      headers
    );

  let credits = { cast: [] };

  try {
    credits =
      await fetchWithRetry(
        creditsUrl,
        headers
      );
  } catch (err) {
    console.error(
      "Credits fetch failed",
      err
    );
  }

  return mapMovieDetails(
    details,
    credits
  );
}