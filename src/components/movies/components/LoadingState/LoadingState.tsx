import './LoadingState.css';

export default function LoadingState() {
  return (
    <div className="movie-skeleton-container" aria-label="Loading content">
      {/* Animated Glowing Shimmer Track */}
      <div className="skeleton-hero-backdrop"></div>
      
      <div className="skeleton-layout">
        {/* Poster Frame Block */}
        <div className="skeleton-poster-frame"></div>
        
        {/* Context Content Rows */}
        <div className="skeleton-text-details">
          <div className="skeleton-row skeleton-title"></div>
          <div className="skeleton-row skeleton-tagline"></div>
          
          <div className="skeleton-strip-group">
            <div className="skeleton-badge"></div>
            <div className="skeleton-badge"></div>
            <div className="skeleton-badge"></div>
          </div>
          
          <div className="skeleton-paragraph">
            <div className="skeleton-row line-1"></div>
            <div className="skeleton-row line-2"></div>
            <div className="skeleton-row line-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
