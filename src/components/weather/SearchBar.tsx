"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  city: string;
  setCity: (city: string) => void;
  onSearch: () => void;
}

export default function SearchBar({
  city,
  setCity,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="searchbar-container flex justify-center">
      <div
        className="
          searchbar-wrapper
          flex w-full items-center justify-center gap-3
        "
      >
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city..."
          className="
            searchbar-input
            h-12 w-[78%]
            rounded-full border bg-white
            px-5 text-sm outline-none

            md:w-1/2
          "
        />

        <button
          onClick={onSearch}
          className="
            searchbar-button
            flex h-12 w-12 items-center justify-center
            rounded-full bg-black text-white

            md:w-auto md:px-7
          "
        >
          <Search size={18} />

          <span className="hidden md:block">
            Send
          </span>
        </button>
      </div>
    </div>
  );
}