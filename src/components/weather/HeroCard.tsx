"use client";

import WeatherStats from "./WeatherStats";

interface HeroCardProps {
  city: string;
  current: any;
}

export default function HeroCard({
  city,
  current,
}: HeroCardProps) {
  return (
    <div className="hero-card bg-white rounded-3xl p-8 shadow-sm text-center">

      <p className="hero-card-subtitle text-sm text-slate-500">
        Current Weather
      </p>

      <h1 className="hero-card-title text-3xl md:text-5xl font-bold mt-2">
        {city}
      </h1>

      <div className="hero-card-temperature text-6xl md:text-8xl font-bold mt-5">
        {current?.temperature_2m ?? "--"}°
      </div>

      <WeatherStats
        temperature={current?.temperature_2m}
        humidity={current?.relative_humidity_2m}
        windSpeed={current?.wind_speed_10m}
      />
    </div>
  );
}