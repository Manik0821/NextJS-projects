




// /**
//  * Handles standard machine-learning related recommendations
//  * Dynamically switches endpoints based on incoming media_type
//  */
// export async function getRecommendations(movieId: number, headers: HeadersInit, media_type = "movie") {
//   // Fix: Switch endpoint template directly based on media type parameter
//   const endpointType = media_type === "tv" ? "tv" : "movie";
//   const url = `${TMDB_BASE_URL}/${endpointType}/${movieId}/recommendations?language=en-US&page=1`;
//   const data = await fetchWithRetry(url, headers);

//   return filterAndFormatMovies(data.results, 10, true, media_type);
// }

