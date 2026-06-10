"use client";

import { MapPin, Thermometer, Wind, Droplets, CloudSun } from "lucide-react";
import WeatherStats from "./WeatherStats";

interface HeroCardProps {
  city: string;
  current: any;
}

export default function HeroCard({ city, current }: HeroCardProps) {
  const hasData = current && city;
  const temp = current?.temperature_2m !== undefined ? Math.round(current.temperature_2m) : null;

  // Determine a subtle decorative gradient style based on current ambient temperature
  const getGradientTheme = () => {
    if (!temp) return "from-slate-500 to-slate-700 text-white";
    if (temp >= 30) return "from-amber-500 via-orange-500 to-rose-600 text-white"; // Hot / Sunny
    if (temp <= 15) return "from-sky-400 via-blue-500 to-indigo-600 text-white";  // Crisp / Cold
    return "from-emerald-400 via-teal-500 to-blue-600 text-white";                // Mild / Moderate
  };

  if (!hasData) {
    return (
      <div className="hero-card flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center min-h-[280px] md:min-h-[340px]">
        <div className="rounded-full bg-slate-50 p-4 text-slate-400 animate-pulse">
          <CloudSun className="h-10 w-10" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-700">No Location Selected</h3>
        <p className="mt-1 max-w-xs text-sm text-slate-400">Search for a city above to discover live climate observations and data insight metrics.</p>
      </div>
    );
  }

  return (
    <div className="hero-card overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-sm transition-all duration-300 hover:shadow-md">
      
      {/* Dynamic Temperature & Ambient Branding Top Block */}
      <div className={`relative bg-gradient-to-br p-6 text-center md:p-10 ${getGradientTheme()}`}>
        
        {/* Subtle Background Geometric Ornamentation */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)] pointer-events-none" />
        
        <div className="relative inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Live Conditions
        </div>

        <h1 className="relative mt-4 flex items-center justify-center gap-2 text-3xl font-extrabold tracking-tight md:text-5xl drop-shadow-sm">
          <MapPin className="h-6 w-6 opacity-80 shrink-0 md:h-8 md:w-8" />
          {city}
        </h1>

        <div className="relative mt-4 flex items-center justify-center font-black tracking-tighter select-none">
          <span className="text-7xl sm:text-8xl md:text-9xl drop-shadow-md">
            {temp}
          </span>
          <span className="text-4xl font-light self-start mt-2 opacity-90 md:text-6xl md:mt-4">°C</span>
        </div>
      </div>

      {/* Structured Stats Content Block */}
      <div className="bg-slate-50/50 p-5 md:p-8 border-t border-slate-100">
        
        {/* Abstract Component Wrapper Mapping Layer */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
            <Thermometer className="h-5 w-5 text-orange-500 mb-1" />
            <span className="text-xs text-slate-400 font-medium">Feels Like</span>
            <span className="text-sm font-bold text-slate-700 mt-0.5">{temp}°C</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
            <Droplets className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-xs text-slate-400 font-medium">Humidity</span>
            <span className="text-sm font-bold text-slate-700 mt-0.5">{current?.relative_humidity_2m ?? "--"}%</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
            <Wind className="h-5 w-5 text-teal-500 mb-1" />
            <span className="text-xs text-slate-400 font-medium">Wind</span>
            <span className="text-sm font-bold text-slate-700 mt-0.5 whitespace-nowrap">{current?.wind_speed_10m ?? "--"} km/h</span>
          </div>
        </div>

        {/* Legacy Child Support Component Layer */}
        <div className="pt-4 border-t border-slate-100/80 hidden">
          <WeatherStats
            temperature={current?.temperature_2m}
            humidity={current?.relative_humidity_2m}
            windSpeed={current?.wind_speed_10m}
          />
        </div>
      </div>
    </div>
  );
}
