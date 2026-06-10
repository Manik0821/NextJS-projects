"use client";

import { Search, Loader2 } from "lucide-react";
import { KeyboardEvent } from "react";

interface SearchBarProps {
  city: string;
  setCity: (city: string) => void;
  onSearch: () => void;
  isLoading?: boolean; // Optional loading parameter to handle button states gracefully
}

export default function SearchBar({
  city,
  setCity,
  onSearch,
  isLoading = false,
}: SearchBarProps) {
  
  // Enable standard keyboard interaction for form submission
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      onSearch();
    }
  };

  return (
    <div className="searchbar-container w-full max-w-2xl mx-auto px-1">
      <div className="searchbar-wrapper relative flex items-center w-full group">
        
        {/* Left Side Decorative Input Icon */}
        <div className="absolute left-4 text-slate-400 pointer-events-none transition-colors duration-300 group-focus-within:text-blue-500">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5 transition-transform duration-300 group-focus-within:scale-105" />
          )}
        </div>

        {/* Improved Interactive Input Canvas */}
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a city (e.g., Mumbai, Tokyo)..."
          disabled={isLoading}
          className="
            searchbar-input
            h-13 w-full
            rounded-2xl border border-slate-200 bg-white
            pl-12 pr-[100px] text-sm font-medium text-slate-800 placeholder-slate-400
            outline-none shadow-sm
            transition-all duration-300 ease-in-out
            
            hover:border-slate-300 hover:shadow-md
            focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:shadow-md
            disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed

            md:h-14 md:text-base md:pr-[120px] md:rounded-full md:pl-14
          "
        />

        {/* Right Docked Action Floating Button */}
        <button
          onClick={onSearch}
          disabled={isLoading || !city.trim()}
          className="
            searchbar-button
            absolute right-2 top-1.5 bottom-1.5
            flex items-center justify-center gap-1.5
            rounded-xl bg-slate-900 text-white font-semibold text-xs tracking-wide uppercase
            px-4 shadow-sm
            transition-all duration-200 ease-in-out
            
            hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2
            disabled:opacity-0 disabled:pointer-events-none disabled:scale-95

            md:top-2 md:bottom-2 md:right-2 md:rounded-full md:px-6 md:text-sm
          "
        >
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}
