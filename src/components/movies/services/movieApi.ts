// features/movie/services/movieApi.ts

import { MovieOption } from "@/lib/types/movie";

// features/movie/services/movieApi.ts

export async function searchMovies(
  query: string
): Promise<MovieOption[]> {
  // CRITICAL: We do NOT append a default media_type string here during autocomplete queries! 👇
  const response = await fetch(
    `/api/features/movie?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  const data = await response.json();

  return data.map((movie: any) => ({
    label: movie.title,
    value: String(movie.id),
    year: movie.release_year,
    rating: `★ ${Number(movie.rating || 0).toFixed(1)}`,
    // CRITICAL: Bind the type returned straight out of your fixed api engine array row! 👇
    media_type: movie.media_type 
  }));
}


export async function fetchMovieDetails(id: string, media_type: string) {
  // Append media_type parameter onto your custom endpoint layout query string
  const response = await fetch(`/api/features/movie?id=${id}&media_type=${media_type}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch media details. Status: ${response.status}`);
  }
  
  return response.json();
}

export async function getRecommendations(
    movieId: string,
  ) {
  
    const response = await fetch(
      `/api/features/movie?recommendations=${movieId}`
    );
  
    if (!response.ok) {
      throw new Error(
        "Failed to load recommendations"
      );
    }
  
    return response.json();
  }