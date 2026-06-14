"use client";

import React, { useState, useEffect } from "react";
import { useMovieStore } from "@/lib/store/MovieStore";
import "./MovieReccomendations.css";

interface TMDBMovieSuggestion {
  id: number;
  title: string;
  release_year: string;
  poster_path: string | null;
  rating: number;
}

interface MovieRecommendationsProps {
  currentMovieId?: number;
  activeMovieTitle?: string;
  onMovieSelect?: (movieData: any) => void;
}

export default function MovieRecommendations({
  currentMovieId,
  activeMovieTitle,
  onMovieSelect,
}: MovieRecommendationsProps) {
  const [movies, setMovies] = useState<TMDBMovieSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { UpdateMovie, UpdateMovieId } = useMovieStore();

  useEffect(() => {
    if (!currentMovieId) {
      setMovies([]);
      return;
    }

    async function fetchRecommendations() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/features/movie?recommendations=${currentMovieId}`
        );

        if (!response.ok) {
          throw new Error("Could not load recommendations.");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const filtered = data
            .filter(
              (movie: TMDBMovieSuggestion) =>
                movie.title !== activeMovieTitle
            )
            .slice(0, 10);

          setMovies(filtered);
        } else {
          setMovies([]);
        }
      } catch (err: any) {
        console.error("Recommendations Fetch Error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [currentMovieId, activeMovieTitle]);

  const handleLoadDetails = (movie: TMDBMovieSuggestion) => {
    UpdateMovieId(String(movie.id));
    UpdateMovie(movie.title);

    onMovieSelect?.(movie);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w342";
  const fallbackPoster = "/images/movie-placeholder.png";

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

      {isLoading && (
        <div className="recommendations-status">
          Curating collections...
        </div>
      )}

      {error && (
        <div className="recommendations-status error">
          {error}
        </div>
      )}

      {!isLoading && movies.length === 0 && currentMovieId && (
        <div className="recommendations-empty">
          No recommendations found.
        </div>
      )}

      {!isLoading && movies.length > 0 && (
        <div className="recommendations-scroll-track">
          {movies.map((movie) => {
            const isActive = activeMovieTitle === movie.title;

            return (
              <article
                key={movie.id}
                className={`rec-card ${isActive ? "is-active" : ""}`}
                onClick={() => handleLoadDetails(movie)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
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
            );
          })}
        </div>
      )}
    </section>
  );
}