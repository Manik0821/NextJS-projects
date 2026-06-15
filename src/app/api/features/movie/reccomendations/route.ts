const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Handles fetch queries with a progressive retry layout safety strategy
 */
async function fetchWithRetry(url: string, headers: HeadersInit, retries = 3): Promise<any> {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { headers, cache: "no-store" });
      if (!response.ok) {
        throw new Error(`TMDB returned status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Reusable utility to filter broken records and format media uniform payloads
 */
// src/app/api/features/movie/reccomendations/route.ts

function filterAndFormatMovies(results: any[], maxItems: number, includeOverview = false, fallbackMediaType = "movie"): any[] {
  return (
    results?.filter((dt: any) => {
      if (!dt || !dt.id || dt.media_type === "person") return false;

      const title = dt.title || dt.name;
      const date = dt.release_date || dt.first_air_date;

      if (!title || !title.trim() || title.toLowerCase() === "unknown title") return false;
      if (!date || !date.trim() || date.toLowerCase() === "n/a") return false;

      return true;
    })
      .slice(0, maxItems)
      .map((movie: any) => {
        const date = movie.release_date || movie.first_air_date;

        // Bulletproof detection: if multi-search, explicitly extract TMDB's type marker string
        const detectedMediaType = fallbackMediaType === "multi"
          ? movie.media_type
          : (movie.media_type || (movie.first_air_date ? "tv" : fallbackMediaType));

        return {
          id: movie.id,
          title: movie.title || movie.name,
          media_type: detectedMediaType, // This will correctly return "tv" for TV series!
          release_year: date && date.includes("-") ? date.split("-")[0] : "N/A",
          poster_path: movie.poster_path || null,
          rating: movie.vote_average ?? 0,
        };
      })
    || []
  );
}


/**
 * Handles live autocompletion searches using /search/multi
 */
// src/app/api/features/movie/reccomendations/route.ts

export async function searchMovies(query: string, headers: HeadersInit, media_type = "movie") {
  const url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query.trim())}&include_adult=false&language=en-US&page=1`;
  const data = await fetchWithRetry(url, headers);

  // FIX: Force the layout parser to look at the individual item content, 
  // NOT the top-level global gateway parameter string! 👇
  return filterAndFormatMovies(data.results, 8, false, "multi");
}


/**
 * Handles standard machine-learning related recommendations
 * Dynamically switches endpoints based on incoming media_type
 */
export async function getRecommendations(movieId: number, headers: HeadersInit, media_type = "movie") {
  // Fix: Switch endpoint template directly based on media type parameter
  const endpointType = media_type === "tv" ? "tv" : "movie";
  const url = `${TMDB_BASE_URL}/${endpointType}/${movieId}/recommendations?language=en-US&page=1`;
  const data = await fetchWithRetry(url, headers);

  return filterAndFormatMovies(data.results, 10, true, media_type);
}

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
    release_date: details.release_date || details.first_air_date || "N/A",
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
