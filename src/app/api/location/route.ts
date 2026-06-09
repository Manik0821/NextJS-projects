// src/app/api/location/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Example:
    // /api/location?name=London
    const locationName = searchParams.get('name');

    if (!locationName) {
      return NextResponse.json(
        { error: 'Location name is required' },
        { status: 400 }
      );
    }

    // Open-Meteo Geocoding API
    const targetUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1`;

    console.log('-> TARGET URL:', targetUrl);

    const response = await fetch(targetUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Geocoding service unavailable' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    const result = data.results[0];

    return NextResponse.json(
      {
        name: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.timezone,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('-> CRASH TRACE LOG:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}