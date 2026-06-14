'use client'
import { create } from 'zustand'

interface MovieState {
    currMovie: string;
    currMovieId: string;
    UpdateMovie: (MovieName: string) => void;
    UpdateMovieId: (MovieId: string) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
    currMovie: "",
    currMovieId: "",
    UpdateMovie: (MovieName) => {
        set(() => ({
            currMovie: MovieName
        }));
        console.log(MovieName);
    },
    UpdateMovieId: (MovieId) => {
        set(() => ({
            currMovieId: MovieId
        }));
        console.log(MovieId);
    }
}));
