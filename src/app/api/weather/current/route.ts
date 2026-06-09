import { NextRequest, NextResponse } from "next/server";
import { getCoordinates } from "@/lib/getCoordinates";

export async function GET(request: NextRequest) {
  try {
    const city = new URL(request.url).searchParams.get("name");

    if (!city) {
      return NextResponse.json(
        { error: "name parameter is required" },
        { status: 400 }
      );
    }

    const { latitude, longitude } = await getCoordinates(city);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    return NextResponse.json({
      current: data.current,
      hourly: {
        time: data.hourly.time,
        temperature_2m: data.hourly.temperature_2m,
        relative_humidity_2m: data.hourly.relative_humidity_2m,
        wind_speed_10m: data.hourly.wind_speed_10m,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}