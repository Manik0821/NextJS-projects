import { NextRequest, NextResponse } from "next/server";

import { searchMovies } from "../services/search.service";
import { getMovieDetails } from "../services/details.service";
import { getRecommendations } from "../services/recommendation.service";
import { getSimilarMovies } from "../services/similar.service";
import { getPopularMovies } from "../services/popular.service";

export async function handleMovieRequest(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q");
    const movieId = searchParams.get("id");
    const recommendationId =
      searchParams.get("recommendations");
    const similarId =
      searchParams.get("similar");
    const popular =
      searchParams.get("popular");

    const media_type =
      searchParams.get("media_type") || "movie";

    const token =
      process.env.TMDB_READ_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          error: "TMDB_READ_ACCESS_TOKEN is missing",
        },
        {
          status: 500,
        }
      );
    }

    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${token.trim()}`,
    };

    // Search
    if (query) {
      const data = await searchMovies(
        query,
        headers,
        media_type
      );

      return NextResponse.json(data);
    }

    // Details
    if (movieId) {
      const data = await getMovieDetails(
        Number(movieId),
        headers,
        media_type
      );

      return NextResponse.json(data);
    }

    // Recommendations
    if (recommendationId) {
      const data = await getRecommendations(
        Number(recommendationId),
        headers,
        media_type
      );

      return NextResponse.json(data);
    }

    // Similar
    if (similarId) {
      const data = await getSimilarMovies(
        Number(similarId),
        headers,
        media_type
      );

      return NextResponse.json(data);
    }

    // Popular
    if (popular) {
      const data = await getPopularMovies(
        headers,
        media_type
      );

      return NextResponse.json(data);
    }

    return NextResponse.json(
      {
        error:
          "Pass q, id, recommendations, similar, or popular.",
      },
      {
        status: 400,
      }
    );
  } catch (error: any) {
    console.error(
      "Movie controller error:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}