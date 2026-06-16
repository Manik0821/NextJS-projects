'use client'
import { create } from 'zustand'

interface MovieState {
    currMovie: string;
    currMovieId: string;
    release_year: string;
    media_type: string;
    UpdateMovie: (MovieName: string, MovieId: string, release_year: string, media_type: string) => void;
}

export const useMovieStore = create<MovieState>((set, get) => ({
    currMovie: "",
    currMovieId: "", // ✅ Fixed: Changed from currMovieID to match the interface
    release_year: "",
    media_type: "tv",
    
    UpdateMovie: (MovieName, MovieId, release_year, media_type) => {
        const current = get();
        
        // ✅ Fixed: Guard now checks all incoming values to prevent stale data bugs
        if (
            current.currMovie === MovieName && 
            current.currMovieId === MovieId &&
            current.release_year === release_year &&
            current.media_type === media_type
        ) {
            return;
        }

        set({
            currMovie: MovieName,
            currMovieId: MovieId,
            release_year: release_year,
            media_type: media_type
        });
    },
}));
