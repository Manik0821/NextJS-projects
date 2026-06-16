// api/features/movie/utils/parseRequest.ts

import { NextRequest } from "next/server";

export function parseMovieRequest(
  request: NextRequest
) {
  const { searchParams } = new URL(request.url);

  const query =
    searchParams.get("q")?.trim() || "";

  const media_type =
    searchParams.get("media_type") || "tv";

  const movieIdParam =
    searchParams.get("id");

  const recommendationParam =
    searchParams.get("recommendations");

  return {
    query,

    media_type,

    movieId: movieIdParam
      ? Number(movieIdParam)
      : null,

    recommendationId: recommendationParam
      ? Number(recommendationParam)
      : null,
  };
}