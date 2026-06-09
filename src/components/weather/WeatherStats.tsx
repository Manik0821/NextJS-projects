"use client";

import { Thermometer, Wind, Droplets } from "lucide-react";

interface WeatherStatsProps {
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
}

export default function WeatherStats({
  temperature,
  humidity,
  windSpeed,
}: WeatherStatsProps) {
  return (
    <div className="weather-stats grid grid-cols-3 gap-3 mt-8">

      <div className="weather-stat-card rounded-2xl bg-slate-50 p-4 flex flex-col items-center">
        <Thermometer size={22} />
        <span className="mt-2 text-xs text-slate-500">Temperature</span>
        <p className="font-semibold">{temperature}°C</p>
      </div>

      <div className="weather-stat-card rounded-2xl bg-slate-50 p-4 flex flex-col items-center">
        <Droplets size={22} />
        <span className="mt-2 text-xs text-slate-500">Humidity</span>
        <p className="font-semibold">{humidity}%</p>
      </div>

      <div className="weather-stat-card rounded-2xl bg-slate-50 p-4 flex flex-col items-center">
        <Wind size={22} />
        <span className="mt-2 text-xs text-slate-500">Wind</span>
        <p className="font-semibold">{windSpeed} km/h</p>
      </div>

    </div>
  );
}