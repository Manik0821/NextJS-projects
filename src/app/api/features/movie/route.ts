// src/app/api/features/movie/route.ts
import { NextRequest, NextResponse } from "next/server";

// Fallback configuration parameters if an environment variable is omitted
const OMDB_API_KEY = process.env.OMDB_API_KEY || "YOUR_FREE_OMDB_KEY";
const BASE_URL = "https://www.omdbapi.com/";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract core parameters passed from client requests
    const s = searchParams.get("s")?.trim();                 // Title search expression (List view)
    const t = searchParams.get("t")?.trim();                 // Strict Title search expression (Single detail view)
    const genre = searchParams.get("genre")?.trim();         // Custom custom target genre parameter filter logic
    const type = searchParams.get("type")?.trim();           // Target medium: movie, series, episode
    const y = searchParams.get("y")?.trim();                 // Production or release year parameter
    const page = searchParams.get("page") || "1";            // Target iteration data page (1-100)
    
    // Dedicated Season and Episode parameters for media detail queries
    const season = searchParams.get("Season")?.trim();       // Target Season index
    const episode = searchParams.get("Episode")?.trim();     // Target Episode index

    // Base validation boundary rule check
    if (!s && !t) {
      return NextResponse.json(
        { Error: "Either parameter 's' (search list) or 't' (target title) is required." },
        { status: 400 }
      );
    }

    // Build the dynamic URL query parameters bound for OMDb API endpoints
    const omdbParams = new URLSearchParams({ apikey: OMDB_API_KEY });

    // Handle Use Case 1: Specific Episode/Season deep dive queries using strict titles (?t=Game of Thrones)
    if (t) {
      omdbParams.append("t", t);
      if (season) omdbParams.append("Season", season);
      if (episode) omdbParams.append("Episode", episode);
      if (type) omdbParams.append("type", type);
      if (y) omdbParams.append("y", y);
      
      const response = await fetch(`${BASE_URL}?${omdbParams.toString()}`);
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Handle Use Case 2: Broad collection list searches via searching parameters (?s=Batman)
    if (s) {
      omdbParams.append("s", s);
      omdbParams.append("page", page);
      if (type) omdbParams.append("type", type);
      if (y) omdbParams.append("y", y);

      const response = await fetch(`${BASE_URL}?${omdbParams.toString()}`);
      const data = await response.json();

      // Implement client-side filtering if genre criteria array lookups are passed
      if (data.Response === "True" && genre && data.Search) {
        const lowercaseGenre = genre.toLowerCase();

        // Query the complete data nodes to extract nested genre lists safely
        const completeDetails = await Promise.all(
          data.Search.map(async (item: any) => {
            const detailUrl = `${BASE_URL}?apikey=${OMDB_API_KEY}&i=${item.imdbID}`;
            const detailRes = await fetch(detailUrl);
            return detailRes.json();
          })
        );

        // Filter objects matching target genres
        const filteredSearch = data.Search.filter((_: any, index: number) => {
          const movieGenres = completeDetails[index]?.Genre?.toLowerCase() || "";
          return movieGenres.includes(lowercaseGenre);
        });

        return NextResponse.json({
          Search: filteredSearch,
          totalResults: filteredSearch.length.toString(),
          Response: filteredSearch.length > 0 ? "True" : "False",
          Error: filteredSearch.length > 0 ? undefined : "No titles found matching that genre.",
        });
      }

      return NextResponse.json(data);
    }

  } catch (error: any) {
    console.error("OMDb API Bridge Routing Error:", error);
    return NextResponse.json(
      { Error: "Internal connection failure processing OMDb payload data.", Details: error.message },
      { status: 500 }
    );
  }
}
