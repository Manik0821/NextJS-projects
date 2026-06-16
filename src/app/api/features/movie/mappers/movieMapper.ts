// mappers/movieMapper.ts

export function mapSearchResults(
    results: any[],
    maxItems = 8,
    fallbackmedia_type = "movie"
  ) {
    return (
      results
        ?.filter((item) => {
          if (!item || !item.id) return false;
          if (item.media_type === "person") return false;
  
          const title = item.title || item.name;
          const date =
            item.release_date ||
            item.first_air_date;
  
          return (
            title &&
            date &&
            title.trim() !== "" &&
            date.trim() !== ""
          );
        })
        .slice(0, maxItems)
        .map((item) => ({
          id: item.id,
  
          title:
            item.title ||
            item.name,
  
          media_type:
            fallbackmedia_type === "multi"
              ? item.media_type
              : item.media_type ||
                (item.first_air_date
                  ? "tv"
                  : fallbackmedia_type),
  
          release_year:
            (
              item.release_date ||
              item.first_air_date ||
              "N/A"
            ).split("-")[0],
  
          poster_path:
            item.poster_path,
  
          rating:
            item.vote_average ?? 0,
        })) || []
    );
  }