'use client';

import SearchBar from '@/lib/Filter-list-dropdown/SearchBar';
import MovieDetailsCard from './components/DetailsCard/MovieDetailsCard';
import MovieRecommendations from './components/Reccomendation/MovieReccomendations';
import AISummary from '../ai/AISummary';
import './MovieDashboard.css';

import { useMovieStore } from '@/lib/store/MovieStore';
import { useMovieSearch } from './hooks/useMovieSearch';
import { useMovieSelection } from './hooks/useMovieSelection';
import { useMovieDetails } from './hooks/useMoviedetails';

export default function MovieSearchDashboard() {
  const {
    currMovie,
    currMovieId,
    media_type, // 💡 Pull active media_type out of store to pass down into sections
  } = useMovieStore();

  // Full movie profile
  const {
    movieDetails,
    loading: isLoading,
    error,
    canShowAISummary,
  } = useMovieDetails(currMovieId);

  // Search/autocomplete
  const {
    searchQuery,
    setSearchQuery,
    apiOptions,
    sortedOptions,
  } = useMovieSearch(movieDetails);

  // Selection handlers
  const {
    handleDropdownSelect,
    handleRecommendationSelect,
  } = useMovieSelection(
    sortedOptions, // 🔥 FIXED: Pass sortedOptions so it perfectly matches what the SearchBar uses!
    setSearchQuery
  );

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
        <div className="dashboard-status-text">
          Loading Search Data...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="dashboard-status-text error">
          {error}
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
            prompt="Analyze the historical relevance, themes, tropes, and public reception of Movie/Genre. Outline what makes these films distinct."
            args={[currMovie, movieDetails]}
            triggerKey={currMovieId}
            wordLimit={100}
          />
        </div>
      )}

      {/* Recommendations */}
      {!isLoading && movieDetails && (
        <MovieRecommendations
          currentMovieId={String(movieDetails.id)}
          activeMovieTitle={movieDetails.title}
          onMovieSelect={handleRecommendationSelect}
        />
      )}

    </div>
  );
}
