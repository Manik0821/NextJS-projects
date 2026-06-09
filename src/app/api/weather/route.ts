import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters with defaults
    const latitude = searchParams.get('latitude') || '52.52';
    const longitude = searchParams.get('longitude') || '13.41';

    // Correct Open-Meteo endpoint
    const targetUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

    console.log('-> FORCED REAL TIME TARGET CHECK:', targetUrl);

    const response = await fetch(targetUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Weather service unavailable' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        current: data.current,
        hourly: data.hourly,
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