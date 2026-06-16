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
    release_year,
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
            prompt={`You are an cinematic summary agent Analyze the historical relevance, themes, tropes, and public reception of ${media_type === "tv" ? "tv series" : "movie"} ${currMovie} from ${release_year}. Outline what makes these films/series distinct. Make sure to only give the relevant data about the movie mentioned with release date`}
            args={[currMovie, movieDetails]}
            triggerKey={currMovieId}
            wordLimit={100}
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
