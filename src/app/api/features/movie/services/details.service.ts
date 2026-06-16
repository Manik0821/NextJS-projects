import { TMDB_BASE_URL } from "../constants/tmbd";
import { fetchWithRetry } from "../utils/fetchWithRetry";

/**
 * Compiles absolute movie profiles and metadata structures together
 */
export async function getMovieDetails(movieId: number, headers: HeadersInit, media_type: string) {
    console.log(media_type);
    const detailsUrl = `${TMDB_BASE_URL}/${media_type}/${movieId}?language=en-US`;
    const creditsUrl = `${TMDB_BASE_URL}/${media_type}/${movieId}/credits?language=en-US`;
    console.log(detailsUrl);
    const details = await fetchWithRetry(detailsUrl, headers);
  
    let credits = { cast: [] };
    try {
      credits = await fetchWithRetry(creditsUrl, headers);
    } catch (creditError) {
      console.error("Credits extraction dropped:", creditError);
    }
  
    return {
      id: details.id,
      title: details.title || details.name,
      tagline: details.tagline || "",
      overview: details.overview || "No description available.",
      release_year: details.release_year || details.first_air_date || "N/A",
      runtime: details.runtime || details.episode_run_time?.[0] || null,
      vote_average: details.vote_average ?? 0,
      genres: details.genres?.map((g: any) => g.name) || [],
      poster_path: details.poster_path || null,
      backdrop_path: details.backdrop_path || null,
      cast: credits.cast?.slice(0, 8).map((actor: any) => ({
        name: actor.name,
        character: actor.character,
        profile_path: actor.profile_path || null,
      })) || [],
    };
  }
  