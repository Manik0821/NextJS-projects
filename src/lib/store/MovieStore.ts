'use client'
import { create } from 'zustand'

interface MovieState {
    currMovie: string;
    currMovieId: string;
    media_type: string;
    UpdateMovie: (MovieName: string, media_type: string) => void;
    UpdateMovieId: (MovieId: string, media_type?: string) => void;
}

export const useMovieStore = create<MovieState>((set, get) => ({
    currMovie: "",
    currMovieId: "",
    media_type: "tv",
    
    UpdateMovie: (MovieName, media_type) => {
        const current = get();
        
        // 🛑 STATE EQUALITY GUARD: If values are identical, exit immediately to save a re-render cycle
        if (current.currMovie === MovieName && current.media_type === media_type) {
            return;
        }

        set({
            currMovie: MovieName,
            media_type: media_type
        });
    },
    
    UpdateMovieId: (MovieId, media_type) => {
        const current = get();
        
        // Resolve media_type logic safely
        const nextMediaType = media_type || current.media_type;

        // 🛑 STATE EQUALITY GUARD: Block identical ID + Media Type dispatches
        if (current.currMovieId === MovieId && current.media_type === nextMediaType) {
            return;
        }

        set({
            currMovieId: MovieId,
            media_type: nextMediaType
        });
    }
}));
