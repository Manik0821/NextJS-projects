// mappers/movieDetailsMapper.ts

export function mapMovieDetails(
    details: any,
    credits: any
  ) {
    return {
      id: details.id,
  
      title:
        details.title ||
        details.name,
  
      tagline:
        details.tagline || "",
  
      overview:
        details.overview ||
        "No description available.",
  
      release_year:
        details.release_date ||
        details.first_air_date ||
        "N/A",
  
      runtime:
        details.runtime ||
        details.episode_run_time?.[0] ||
        null,
  
      vote_average:
        details.vote_average ?? 0,
  
      genres:
        details.genres?.map(
          (genre: any) => genre.name
        ) || [],
  
      poster_path:
        details.poster_path,
  
      backdrop_path:
        details.backdrop_path,
  
      cast:
        credits.cast
          ?.slice(0, 8)
          .map((actor: any) => ({
            name: actor.name,
            character:
              actor.character,
            profile_path:
              actor.profile_path,
          })) || [],
    };
  }