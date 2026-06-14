'use client'
import React from 'react'
import './MovieDetailsCard.css'

interface CastMember {
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieDetailsProps {
  data: {
    id: number | string; // Loosened type slightly to support payload blending safely
    title: string;
    tagline?: string;
    overview: string;
    release_date: string;
    runtime: number;
    vote_average: number;
    genres: string[];
    poster_path: string | null;
    backdrop_path: string | null;
    cast: CastMember[];
  }
}

export default function MovieDetailsCard({ data }: MovieDetailsProps) {
  const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500/"; 
  const TMDB_BACKDROP_BASE = "https://tmdb.org";

  // FIXED: Changed to valid direct image file links to prevent parsing crashes
  const fallbackPoster = "https://unsplash.com";
  const fallbackAvatar = "https://unsplash.com";

  const backdropUrl = data.backdrop_path ? `${TMDB_BACKDROP_BASE}${data.backdrop_path}` : '';

  // FIXED: Safe adaptive parsing matching both TMDB (YYYY-MM-DD) and OMDB (DD MMM YYYY) strings
  const displayYear = React.useMemo(() => {
    if (!data.release_date) return 'N/A';
    
    // Catch TMDB format (hyphen separated)
    if (data.release_date.includes('-')) {
      return data.release_date.split('-')[0];
    }
    
    // Catch OMDB or space-separated format, grabbing the last segment
    const segments = data.release_date.trim().split(/\s+/);
    const lastSegment = segments[segments.length - 1];
    
    return lastSegment && !isNaN(Number(lastSegment)) ? lastSegment : data.release_date;
  }, [data.release_date]);

  return (
    <article className="movie-detail-card">
      {/* Decorative Hero Backdrop */}
      {backdropUrl && (
        <div 
          className="movie-backdrop-hero" 
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), #1a1a1a), url(${backdropUrl})` }}
        />
      )}

      <div className="movie-main-content">
        {/* Poster Grid Segment */}
        <div className="movie-poster-frame">
          <img 
            src={
              data.poster_path?.startsWith('http') 
                ? data.poster_path 
                : data.poster_path 
                  ? `${TMDB_IMAGE_BASE}${data.poster_path}` 
                  : fallbackPoster
            } 
            alt={data.title}
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.onerror = null; 
              imgElement.src = fallbackPoster;
            }}
          />
        </div>

        {/* Textual Metadata Info Grid Segment */}
        <div className="movie-text-details">
          <header className="movie-header-group">
            <h2 className="movie-display-title">{data.title}</h2>
            {data.tagline && <p className="movie-tagline-text">"{data.tagline}"</p>}
          </header>

          <div className="movie-stats-strip">
            <span className="stat-badge fill-rating">★ {Number(data.vote_average || 0).toFixed(1)}</span>
            <span className="stat-badge">{data.runtime ? `${data.runtime} min` : 'N/A'}</span>
            <span className="stat-badge">{displayYear}</span>
          </div>

          <div className="movie-genres-row">
            {data.genres && data.genres.length > 0 ? (
              data.genres.map((genre) => (
                <span key={genre} className="genre-pill">{genre}</span>
              ))
            ) : (
              <span className="genre-pill">General</span>
            )}
          </div>

          <section className="movie-synopsis">
            <h3>Overview</h3>
            <p>{data.overview || "No synopsis available for this title."}</p>
          </section>

          {/* Cast Carousels */}
          {data.cast && data.cast.length > 0 && (
            <section className="movie-cast-section">
              <h3>Top Cast</h3>
              <div className="cast-scroll-grid">
                {data.cast.map((actor, idx) => (
                  <div key={`${actor.name}-${idx}`} className="cast-member-node">
                    <div className="cast-avatar-circle">
                      {actor.profile_path ? (
                        <img 
                          src={`${TMDB_IMAGE_BASE}${actor.profile_path}`} 
                          alt={actor.name} 
                          loading="lazy" 
                          onError={(e) => {
                            // FIXED: Removed the crashing unsplash website string reference
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.onerror = null;
                            imgElement.src = fallbackAvatar;
                          }}
                        />
                      ) : (
                        <div className="avatar-fallback">{actor.name ? actor.name.charAt(0) : '?'}</div>
                      )}
                    </div>
                    <div className="cast-meta-info">
                      <span className="actor-real-name">{actor.name}</span>
                      <span className="actor-character-name">{actor.character}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  )
}
