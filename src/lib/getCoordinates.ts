export async function getCoordinates(city: string) {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
  
    if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
    }
  
    const data = await response.json();
  
    if (!data.results?.length) {
      throw new Error(`Location "${city}" not found`);
    }
  
    return {
      name: data.results[0].name,
      country: data.results[0].country,
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      timezone: data.results[0].timezone,
    };
  }