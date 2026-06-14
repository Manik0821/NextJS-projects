"use client";

import "./MovieReccomendations.css";
import { useMovieStore } from "@/lib/store/MovieStore";
import { useRecommendations } from "../../hooks/useRecommendations";

interface MovieRecommendationsProps {
  currentMovieId: string;
  activeMovieTitle?: string;
  onMovieSelect?: (movieData: any) => void;
}

export default function MovieRecommendations({
  currentMovieId,
  activeMovieTitle,
  onMovieSelect,
}: MovieRecommendationsProps) {

  const {
    movies,
    loading,
    error,
  } = useRecommendations(
    currentMovieId,
    activeMovieTitle
  );

  const { UpdateMovie, UpdateMovieId } = useMovieStore();

  const handleLoadDetails = (movie: any) => {
    UpdateMovieId(String(movie.id));
    UpdateMovie(movie.title);

    onMovieSelect?.(movie);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const TMDB_IMAGE_BASE =
    "https://image.tmdb.org/t/p/w342";

  const fallbackPoster =
    "/images/movie-placeholder.png";

  return (
    <section
      className="recommendations-container"
      aria-label="Related Recommendations"
    >
      <header className="recommendations-header">
        <h3 className="recommendations-title">
          Recommended Movies
        </h3>

        <p className="recommendations-subtitle">
          Similar movies you might enjoy
        </p>
      </header>

      {loading && (
        <div className="recommendations-status">
          Curating collections...
        </div>
      )}

      {error && (
        <div className="recommendations-status error">
          {error}
        </div>
      )}

      {!loading && movies.length === 0 && currentMovieId && (
        <div className="recommendations-empty">
          No recommendations found.
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="recommendations-scroll-track">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className={`rec-card ${
                activeMovieTitle === movie.title
                  ? "is-active"
                  : ""
              }`}
              onClick={() => handleLoadDetails(movie)}
              role="button"
              tabIndex={0}
              aria-pressed={activeMovieTitle === movie.title}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLoadDetails(movie);
                }
              }}
            >
              <div className="rec-card-poster-frame">
                <img
                  src={
                    movie.poster_path
                      ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                      : fallbackPoster
                  }
                  alt={`${movie.title} poster`}
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.onerror = null;
                    img.src = fallbackPoster;
                  }}
                />
              </div>

              <div className="rec-card-content">
                <h4 className="rec-card-title">
                  {movie.title}
                </h4>

                <div className="rec-card-metadata">
                  <span className="rec-year">
                    {movie.release_year}
                  </span>

                  <span className="rec-type">
                    ★ {Number(movie.rating || 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}