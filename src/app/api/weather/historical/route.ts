import { NextRequest, NextResponse } from "next/server";
import { getCoordinates } from "@/lib/getCoordinates";

export async function GET(request: NextRequest) {
  try {
    const city =
      new URL(request.url).searchParams.get("name");

    if (!city) {
      return NextResponse.json(
        { error: "name parameter is required" },
        { status: 400 }
      );
    }

    const { latitude, longitude } =
      await getCoordinates(city);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const formatDate = (date: Date) =>
      date.toISOString().split("T")[0];

    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${formatDate(
        startDate
      )}&end_date=${formatDate(
        endDate
      )}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum`
    );

    const data = await response.json();

    return NextResponse.json({
      daily: data.daily,
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