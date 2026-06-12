"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import "./MovieDashboard.css";
import AISummary from "../ai/AISummary";

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export default function MovieDashboard() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Custom States for tracking execution sequences
  const [lastSearchedTerm, setLastSearchedTerm] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const searchMovies = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setShowSummary(false); // Reset state tracking before new network fetch

      const response = await fetch(
        `/api/features/movie?s=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
        setLastSearchedTerm(query.trim()); // Save active keyword on query success
      } else {
        setMovies([]);
        setLastSearchedTerm("");
      }

      setSelectedMovie(null);
    } catch (error) {
      console.error(error);
      setLastSearchedTerm("");
    } finally {
      setTimeout(()=>{
        setLoading(false);
      },2000)
    }
  };

  // Delayed reveal mechanism for the AI summary element
  useEffect(() => {
    if (!lastSearchedTerm) {
      setShowSummary(false);
      return;
    }

    // Delays the AI execution engine layout step by 2.5 seconds
    const timer = setTimeout(() => {
      setShowSummary(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [lastSearchedTerm]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchMovies();
    }
  };

  const loadMovieDetails = async (title: string) => {
    try {
      const response = await fetch(
        `/api/features/movie?t=${encodeURIComponent(title)}`
      );

      const data = await response.json();
      setSelectedMovie(data);
      
      // Smoothly focus details panel viewport on mobile interaction
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="movie-dashboard">
      {/* Search Layout Group */}
      <section className="movie-search">
        <input
          className="movie-input"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="movie-search-button" onClick={searchMovies}>
          Search
        </button>
      </section>

      {/* Loading Block State */}
      {loading && (
        <div className="movie-loading">
          <div className="movie-spinner"></div>
          <p>Analyzing cinematic indices...</p>
        </div>
      )}

      {/* AI Summary Panel - Managed with custom delay sequence */}
      {showSummary && !loading && lastSearchedTerm && (
        <div className="movie-ai-section">
          <AISummary
            title={`Cinematic Analytics: "${lastSearchedTerm}"`}
            prompt="Analyze the historical relevance, themes, tropes, and public reception of Movie/Genre. Outline what makes these films distinct."
            args={[lastSearchedTerm]}
            triggerKey={lastSearchedTerm}
            wordLimit={100}
          />
        </div>
      )}

      {/* Hero Empty Layout State */}
      {!selectedMovie && !lastSearchedTerm && !loading && (
        <section className="movie-hero">
          🍿 Search for a movie title above to extract listing metadata.
        </section>
      )}

      {/* Detailed Movie Element Panel */}
      {selectedMovie && !loading && (
        <section className="movie-detail">
          <img
            src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "https://unsplash.com"}
            alt={selectedMovie.Title}
            className="movie-detail-poster"
          />

          <div className="movie-detail-content">
            <h2>{selectedMovie.Title}</h2>
            <div className="movie-tags">
              <span className="movie-tag">⭐ {selectedMovie.imdbRating || "N/A"}</span>
              <span className="movie-tag">📅 {selectedMovie.Year}</span>
              <span className="movie-tag">🎬 {selectedMovie.Genre}</span>
              <span className="movie-tag">⏱ {selectedMovie.Runtime}</span>
            </div>
            <p className="movie-plot">{selectedMovie.Plot}</p>
          </div>
        </section>
      )}

      {/* Results Matrix Block */}
      {movies.length > 0 && !loading && (
        <section className="movie-grid">
          {movies.map((movie) => (
            <article
              key={movie.imdbID}
              className={`movie-card ${selectedMovie?.imdbID === movie.imdbID ? "is-active" : ""}`}
              onClick={() => loadMovieDetails(movie.Title)}
            >
              <div className="movie-card-image-wrap">
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "https://unsplash.com"}
                  alt={movie.Title}
                  className="movie-card-image"
                />
              </div>

              <div className="movie-card-content">
                <h3>{movie.Title}</h3>
                <div className="movie-card-meta">
                  <span>{movie.Year}</span>
                  <span className="movie-card-type">{movie.Type}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}