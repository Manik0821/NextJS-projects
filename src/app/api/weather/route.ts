// src/app/api/weather/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Boilerplate layout to satisfy the build system
    const mockWeatherData = {
      location: "New Delhi",
      temperature: "28°C",
      condition: "Sunny",
      humidity: "45%"
    };

    return NextResponse.json(mockWeatherData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
