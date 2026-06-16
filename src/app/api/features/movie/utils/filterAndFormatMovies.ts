/**
 * Reusable utility to filter broken records and format media uniform payloads
 */
// src/app/api/features/movie/reccomendations/route.ts

export function filterAndFormatMovies(results: any[], maxItems: number, includeOverview = false, fallbackMediaType = "movie"): any[] {
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