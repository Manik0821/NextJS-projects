import { NextRequest, NextResponse } from "next/server";
import { searchMovies, getRecommendations, getMovieDetails } from "./reccomendations/route";

export async function GET(request: NextRequest) {
  console.log(request.url);
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const movieId = searchParams.get("id");
    const recommendationId = searchParams.get("recommendations");
    // Normalize or fallback to "movie" if the caller misses passing the string
    const media_type = searchParams.get("media_type") || "tv";
    console.log(searchParams,media_type);
    const token = process.env.TMDB_READ_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "TMDB_READ_ACCESS_TOKEN is missing." }, { status: 500 });
    }

    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${token.trim()}`,
    };

    // 1. OPERATION GATEWAY: TEXT AUTOCOMPLETE SEARCH
    if (query) {
      // FIXED: Added media_type parameter here 👇
      const suggestions = await searchMovies(query, headers, media_type);
      return NextResponse.json(suggestions);
    }

    // 2. OPERATION GATEWAY: TMDB RECOMMENDATIONS 
    if (recommendationId) {
      const parsedRecId = Number(recommendationId);
      if (isNaN(parsedRecId)) {
        return NextResponse.json({ error: "Invalid recommendation id parameter." }, { status: 400 });
      }
      // FIXED: Added media_type parameter here 👇
      const recommendations = await getRecommendations(parsedRecId, headers, media_type);
      return NextResponse.json(recommendations);
    }

    // 3. OPERATION GATEWAY: DETAILED CARD PROFILE LOOKUP
    if (movieId) {
      const parsedMovieId = Number(movieId);
      if (isNaN(parsedMovieId)) {
        return NextResponse.json({ error: "Invalid id parameter." }, { status: 400 });
      }
      const movieProfile = await getMovieDetails(parsedMovieId, headers, media_type);
      return NextResponse.json(movieProfile);
    }

    // FALLBACK PROTECTION: Missing active dispatch parameter identifiers
    return NextResponse.json(
      { error: "Bad Request. Pass either query token (?q=), target ID (?id=), or reference (?recommendations=)." },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("API Gateway Exception:", error);
    return NextResponse.json(
      { error: "Internal server error occurred.", details: error.message || "" },
      { status: 500 }
    );
  }
}
