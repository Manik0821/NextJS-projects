export interface MovieDetails {
  id: number;
  title: string;
  tagline?: string;
  overview?: string;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  genres?: string[];
  poster_path?: string;
  backdrop_path?: string;
  media_type?: string;
}

export interface MovieOption {
  label: string;
  value: string;
  year: string;
  rating: string;
  movie_data:string;
  media_type?:string;
}