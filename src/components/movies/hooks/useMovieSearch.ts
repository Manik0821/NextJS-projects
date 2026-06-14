import { useEffect, useMemo, useRef, useState } from "react";
import { MovieOption } from "@/lib/types/movie";
import { searchCache } from "../cache/movieCache";
import { getRelevanceScore } from "../utils/getRelevantScores";
import { searchMovies } from "../services/movieApi";

export function useMovieSearch(movieDetails: any) {
    const [searchQuery, setSearchQuery] = useState("");
    const [apiOptions, setApiOptions] = useState<MovieOption[]>([]);

    // Prevent duplicate search after selecting a movie
    const bypassSearchForTitleRef = useRef<string | null>(null);

    // Keep textbox synchronized with selected movie
    useEffect(() => {
        if (!movieDetails?.title) return;

        bypassSearchForTitleRef.current = movieDetails.title;
        setSearchQuery(movieDetails.title);
    }, [movieDetails]);

    // ==================================================
    // Debounced Search
    // ==================================================
    useEffect(() => {
        const trimmedQuery = searchQuery.trim();

        if (!trimmedQuery) {
            setApiOptions([]);
            return;
        }

        // Skip search if title was programmatically injected
        if (
            bypassSearchForTitleRef.current &&
            trimmedQuery.toLowerCase() ===
            bypassSearchForTitleRef.current.toLowerCase()
        ) {
            bypassSearchForTitleRef.current = null;
            return;
        }

        // Cache hit
        if (searchCache[trimmedQuery]) {
            setApiOptions(searchCache[trimmedQuery]);
            return;
        }

        const debounceTimer = setTimeout(async () => {
            try {
                const formatted = await searchMovies(trimmedQuery);

                searchCache[trimmedQuery] = formatted;

                setApiOptions(formatted);

            } catch (error) {
                console.error("Live search failed:", error);
                setApiOptions([]);
            }
        }, 350);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // ==================================================
    // Relevance Sorting
    // ==================================================
    const sortedOptions = useMemo(() => {
        if (!searchQuery.trim()) return apiOptions;

        return [...apiOptions].sort((a, b) => {
            const scoreA = getRelevanceScore(a.label, searchQuery);
            const scoreB = getRelevanceScore(b.label, searchQuery);

            if (scoreA === scoreB) {
                return a.label.localeCompare(b.label);
            }

            return scoreB - scoreA;
        });
    }, [apiOptions, searchQuery]);

    return {
        searchQuery,
        setSearchQuery,
        apiOptions,        
        sortedOptions,
    };
}