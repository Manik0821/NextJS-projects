export async function fetchWithRetry(
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
          throw new Error(`TMDB returned status: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        lastError = error;
  
        if (i < retries - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, 1000 * (i + 1))
          );
        }
      }
    }
  
    throw lastError;
  }