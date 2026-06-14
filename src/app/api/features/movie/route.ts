// src/app/api/features/movie/route.ts

import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchWithRetry(
  url: string,
  headers: HeadersInit,
  retries = 3
) {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`TMDB returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      if (i < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (i + 1))
        );
      }
    }
  }

  throw lastError;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q");
    const movieId = searchParams.get("id");
    const recommendationId =
      searchParams.get("recommendations");

    const token = process.env.TMDB_READ_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          error: "TMDB_READ_ACCESS_TOKEN is missing.",
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

    // ====================================================
    // SEARCH MOVIES
    // ====================================================
    if (query) {
      try {
        const data = await fetchWithRetry(
          `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
            query.trim()
          )}&include_adult=false&language=en-US&page=1`,
          headers
        );

        const suggestions =
          data.results?.slice(0, 8).map((movie: any) => ({
            id: movie.id,
            title: movie.title || "Unknown Title",
            release_year:
              movie.release_date?.split("-")[0] || "N/A",
            poster_path: movie.poster_path,
            rating: movie.vote_average,
          })) || [];

        return NextResponse.json(suggestions);
      } catch (error: any) {
        console.error("TMDB Search Error:", error);

        return NextResponse.json(
          {
            error: error.message,
          },
          {
            status: 500,
          }
        );
      }
    }

    // ====================================================
    // RECOMMENDATIONS
    // ====================================================
    if (recommendationId) {
      const parsedId = Number(recommendationId);

      if (isNaN(parsedId)) {
        return NextResponse.json(
          {
            error: "Invalid recommendation movie id",
          },
          {
            status: 400,
          }
        );
      }

      try {
        const data = await fetchWithRetry(
          `${TMDB_BASE_URL}/movie/${parsedId}/recommendations?language=en-US&page=1`,
          headers
        );

        const recommendations =
          data.results?.slice(0, 10).map((movie: any) => ({
            id: movie.id,
            title: movie.title || "Unknown Title",
            release_year:
              movie.release_date?.split("-")[0] || "N/A",
            poster_path: movie.poster_path,
            rating: movie.vote_average,
            overview: movie.overview,
          })) || [];

        return NextResponse.json(recommendations);
      } catch (error: any) {
        console.error(
          "TMDB Recommendation Error:",
          error
        );

        return NextResponse.json(
          {
            error: error.message,
          },
          {
            status: 500,
          }
        );
      }
    }

    // ====================================================
    // MOVIE DETAILS
    // ====================================================
    if (movieId) {
      const parsedId = Number(movieId);

      if (isNaN(parsedId)) {
        return NextResponse.json(
          {
            error: "Invalid movie id",
          },
          {
            status: 400,
          }
        );
      }

      try {
        // Fetch movie details
        const details = await fetchWithRetry(
          `${TMDB_BASE_URL}/movie/${parsedId}?language=en-US`,
          headers
        );

        // Credits are optional
        let credits: any = { cast: [] };

        try {
          credits = await fetchWithRetry(
            `${TMDB_BASE_URL}/movie/${parsedId}/credits?language=en-US`,
            headers
          );
        } catch (creditError) {
          console.error(
            "Credits lookup failed:",
            creditError
          );
        }

        const movie = {
          id: details.id,
          title: details.title,
          tagline: details.tagline,
          overview: details.overview,
          release_date: details.release_date,
          runtime: details.runtime,
          vote_average: details.vote_average,

          genres:
            details.genres?.map(
              (genre: any) => genre.name
            ) || [],

          poster_path: details.poster_path,
          backdrop_path: details.backdrop_path,

          cast:
            credits.cast?.slice(0, 8).map((actor: any) => ({
              name: actor.name,
              character: actor.character,
              profile_path: actor.profile_path,
            })) || [],
        };

        return NextResponse.json(movie);
      } catch (error: any) {
        console.error(
          "TMDB Detail Error:",
          error
        );

        return NextResponse.json(
          {
            error: error.message,
          },
          {
            status: 500,
          }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Pass either ?q=, ?id= or ?recommendations=",
      },
      {
        status: 400,
      }
    );
  } catch (error: any) {
    console.error("Global Error:", error);

    return NextResponse.json(
      {
        error: "Server exception",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
