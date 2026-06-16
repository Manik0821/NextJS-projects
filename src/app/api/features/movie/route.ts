import { NextRequest } from "next/server";
import { handleMovieRequest } from "./controllers/movieController";

export async function GET(request: NextRequest) {
  return handleMovieRequest(request);
}