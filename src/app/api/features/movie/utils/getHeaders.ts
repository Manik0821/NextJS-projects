// api/features/movie/utils/getHeaders.ts

export function getTMDBHeaders() {
    const token = process.env.TMDB_READ_ACCESS_TOKEN;
  
    if (!token) {
      throw new Error(
        "TMDB_READ_ACCESS_TOKEN is missing."
      );
    }
  
    return {
      accept: "application/json",
      Authorization: `Bearer ${token.trim()}`,
    };
  }