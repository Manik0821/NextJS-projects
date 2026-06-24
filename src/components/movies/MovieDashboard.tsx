'use client';

import SearchBar from './components/searchBar/searchBar';
import MovieDetailsCard from './components/DetailsCard/MovieDetailsCard';
import MovieRecommendations from './components/Reccomendation/MovieReccomendations';
import AISummary from '../ai/AISummary';
import './MovieDashboard.css';

import { useMovieStore } from '@/lib/store/MovieStore';
import { useMovieSearch } from './hooks/useMovieSearch';
import { useMovieSelection } from './hooks/useMovieSelection';
import { useMovieDetails } from './hooks/useMoviedetails';
import LoadingState from './components/LoadingState/LoadingState';

export default function MovieSearchDashboard() {
  const {
    currMovie,
    currMovieId,
    release_year,
    media_type,
  } = useMovieStore();

  const {
    movieDetails,
    loading: isLoading,
    error,
    canShowAISummary,
  } = useMovieDetails(currMovieId);

  const {
    searchQuery,
    setSearchQuery,
    apiOptions,
    sortedOptions,
  } = useMovieSearch(movieDetails);

  const {
    handleDropdownSelect,
    handleRecommendationSelect,
  } = useMovieSelection(
    sortedOptions,
    setSearchQuery
  );

  // Helper flag to check if we are in an empty/initial landing state
  const isInitialLandingState = !isLoading && !movieDetails && !error;

  return (
    <div className="movie-dashboard-wrapper">

      {/* Search */}
      <div className="search-section">
        <SearchBar
          options={sortedOptions}
          value={searchQuery}
          onSelect={handleDropdownSelect}
          onSearchChange={setSearchQuery}
          placeholder="Type to search movies or TV shows..."
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <LoadingState />
      )}

      {/* Error */}
      {error && (
        <div className="dashboard-status-text error">
          {error}
        </div>
      )}

      {/* EMPTY LANDING STATE: Shows beautiful placeholders when no movie is loaded yet */}
      {isInitialLandingState && (
        <div className="movie-landing-placeholder">
          <div className="placeholder-illustration">🎬</div>
          <h2 className="placeholder-title">Discover Your Next Watch</h2>
          <p className="placeholder-subtitle">
            Search across thousands of blockbusters, indie gems, and trending TV series to uncover detailed analytics and dynamic recommendations.
          </p>
        </div>
      )}

      {/* Details */}
      {!isLoading && movieDetails && (
        <MovieDetailsCard data={movieDetails} />
      )}

      {/* AI Summary */}
      {canShowAISummary && !isLoading && movieDetails && (
        <div className="movie-ai-section">
          <AISummary
            title={`Cinematic Analytics: "${currMovie}"`}
            prompt="Next-JS/generate/Cine_Summarizer"
            triggerKey={currMovieId}
            wordLimit={100}
            variables={{
              media_type: movieDetails?.media_type ?? "movie",
              title: currMovie,
              release_year: movieDetails?.release_date?.split("-")[0] ?? "",
              fallback_overview: movieDetails?.overview ?? "",
            }}
          />
        </div>
      )}

      {!isLoading && movieDetails && (
        <>
          <MovieRecommendations
            title="Recommended Movies"
            subtitle="Recommended Movies"
            type="recommendations"
            currentMovieId={movieDetails.id}
            media_type={movieDetails.media_type}
            activeMovieTitle={movieDetails.title}
            onMovieSelect={handleRecommendationSelect}
          />

          <MovieRecommendations
            title="Similar Movies"
            subtitle="Based on your search"
            type="similar"
            currentMovieId={movieDetails.id}
            media_type={movieDetails.media_type}
            activeMovieTitle={movieDetails.title}
            onMovieSelect={handleRecommendationSelect}
          />

          <MovieRecommendations
            title="Popular Right Now"
            subtitle="Trending among viewers"
            type="popular"
            currentMovieId={movieDetails.id}
            media_type={movieDetails.media_type}
            activeMovieTitle={movieDetails.title}
            onMovieSelect={handleRecommendationSelect}
          />
        </>
      )}

    </div>
  );
}
