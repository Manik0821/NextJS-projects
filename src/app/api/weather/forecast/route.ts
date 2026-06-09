import { NextRequest, NextResponse } from 'next/server';
import { getCoordinates } from '@/lib/getCoordinates';

export async function GET(request: NextRequest) {
  try {
    const city =
      new URL(request.url).searchParams.get('name');

    if (!city) {
      return NextResponse.json(
        { error: 'name parameter is required' },
        { status: 400 }
      );
    }

    const { latitude, longitude } =
      await getCoordinates(city);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=7`
    );

    const data = await response.json();

    return NextResponse.json(data.daily);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}