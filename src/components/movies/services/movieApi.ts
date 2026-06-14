// features/movie/services/movieApi.ts

import { MovieOption } from "@/lib/types/movie";

export async function searchMovies(
  query: string
): Promise<MovieOption[]> {

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
    rating: `★ ${Number(movie.rating || 0).toFixed(1)}`
  }));
}

export async function fetchMovieDetails(
  movieId: string
) {

  const response = await fetch(
    `/api/features/movie?id=${movieId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load movie details");
  }

  return response.json();
}

export async function getRecommendations(
    movieId: string
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