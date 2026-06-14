'use client'

import { useMovieStore } from '@/lib/store/MovieStore'
import React, { useState, useEffect } from 'react'
import SearchBar, { Option } from '@/lib/Filter-list-dropdown/SearchBar'
import MovieDetailsCard from './components/DetailsCard/MovieDetailsCard'
import MovieRecommendations from './components/Reccomendation/MovieReccomendations'
import AISummary from '../ai/AISummary'
import './MovieDashboard.css'

export default function MovieSearchDashboard() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [apiOptions, setApiOptions] = useState<Option[]>([])
  const [movieDetails, setMovieDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [MovieSummary,showAISummary] = useState<boolean>(false);

  const {
    currMovie,
    currMovieId,
    UpdateMovie,
    UpdateMovieId
  } = useMovieStore()

  // ===================================================
  // Load full movie profile whenever movie ID changes
  // ===================================================
  useEffect(() => {
    if (!currMovieId) {
      setMovieDetails(null)
      return
    }

    async function getMovieDetails() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `/api/features/movie?id=${currMovieId}`
        )

        if (!response.ok) {
          throw new Error("Failed to load movie details.")
        }

        const data = await response.json()

        setMovieDetails(data)

        if (data.title && currMovie !== data.title) {
          UpdateMovie(data.title)
        }

        setSearchQuery(data.title)
      } catch (err: any) {
        setError(err.message || "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    getMovieDetails()
  }, [currMovieId])

  // ===================================================
  // Debounced autocomplete search
  // ===================================================
  useEffect(() => {
    if (!searchQuery.trim()) {
      setApiOptions([])
      showAISummary(false)
      return
    }

    // Prevent searching again for currently opened movie
    if (
      movieDetails &&
      searchQuery.trim().toLowerCase() ===
        movieDetails.title.toLowerCase()
    ) {
      showAISummary(true)
      return
    }

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/features/movie?q=${encodeURIComponent(
            searchQuery.trim()
          )}`
        )

        if (!response.ok) {
          setApiOptions([])
          return
        }

        const data = await response.json()

        if (Array.isArray(data)) {
          const formatted: Option[] = data.map((movie: any) => ({
            label: movie.title,
            value: String(movie.id),
            year: movie.release_year,
            rating: `★ ${Number(movie.rating || 0).toFixed(1)}`
          }))

          setApiOptions(formatted)
        } else {
          setApiOptions([])
        }
      } catch (error) {
        console.error("Live search failed:", error)
        setApiOptions([])
      }
    }, 350)

    const timer = setTimeout(() => {
      showAISummary(true);
    }, 2500);

    // return () => clearTimeout(timer);

    return () => (clearTimeout(debounceTimer),clearTimeout(timer))
  }, [searchQuery, movieDetails])

  // ===================================================
  // Dropdown selection
  // ===================================================
  const handleDropdownSelect = (value: string) => {
    const selectedOption = apiOptions.find(
      option => option.value === value
    )

    if (!selectedOption) return

    UpdateMovieId(value)
    UpdateMovie(selectedOption.label)
  }

  // ===================================================
  // Recommendation click handler
  // ===================================================
  const handleRecommendationSelect = (
    moviePayload: any
  ) => {
    const nextId = String(moviePayload.id || "")
    const nextTitle = moviePayload.title || ""

    UpdateMovieId(nextId)
    UpdateMovie(nextTitle)

    setSearchQuery(nextTitle)

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <div className="movie-dashboard-wrapper">

      {/* Search */}
      <div className="search-section">
        <SearchBar
          options={apiOptions}
          value={searchQuery}
          onSelect={handleDropdownSelect}
          onSearchChange={setSearchQuery}
          placeholder="Type to search movies..."
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
        <MovieDetailsCard
          data={movieDetails}
        />
      )}

      {/* AI Summary Panel - Managed with custom delay sequence */}
      {MovieSummary && !isLoading && (
        <div className="movie-ai-section">
          <AISummary
            title={`Cinematic Analytics: "${currMovie}"`}
            prompt="Analyze the historical relevance, themes, tropes, and public reception of Movie/Genre. Outline what makes these films distinct."
            args={[currMovie,movieDetails]}
            triggerKey={currMovie}
            wordLimit={100}
          />
        </div>
      )}

      {/* Recommendations */}
      {!isLoading && movieDetails && (
        <MovieRecommendations
          currentMovieId={movieDetails.id}
          activeMovieTitle={movieDetails.title}
          onMovieSelect={handleRecommendationSelect}
        />
      )}

    </div>
  )
}