"use client";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useState } from "react";
import { History, Flame, Snowflake, Sparkles } from "lucide-react";

interface Props {
  daily: any;
}

export default function HistoricalChart({ daily }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!daily || !daily.time) return null;

  const data = daily.time.map(
    (date: string, idx: number) => ({
      day: new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      temp: Math.round(daily.temperature_2m_max[idx]),
    })
  );

  // Calculate helpful historical data metrics
  const temperatures = data.map((d: any) => d.temp);
  const highestTemp = Math.max(...temperatures);
  const lowestTemp = Math.min(...temperatures);
  const averageTemp = Math.round(temperatures.reduce((a: any, b: any) => a + b, 0) / temperatures.length);

  return (
    <div className="historical-chart flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:gap-6 md:p-6">
      
      {/* Visual Header & Smart Insight Grid */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500">Historical Record</h3>
            <p className="text-xs text-slate-400">Past 7 days peak temperatures</p>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
          <div className="flex items-center justify-center gap-1 rounded-lg bg-orange-50 px-2 py-1.5 text-xs font-semibold text-orange-600 border border-orange-100/50">
            <Flame className="h-3.5 w-3.5" />
            <span>Max: {highestTemp}°</span>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-lg bg-sky-50 px-2 py-1.5 text-xs font-semibold text-sky-600 border border-sky-100/50">
            <Snowflake className="h-3.5 w-3.5" />
            <span>Min: {lowestTemp}°</span>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-lg bg-emerald-50 px-2 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-100/50 col-span-3 sm:col-span-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Avg: {averageTemp}°</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-[300px] w-full md:h-[400px]">
        <ResponsiveContainer width="100%" height="90%">
        <BarChart 
  data={data}
  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
  onMouseMove={(state) => {
    // Check if the property exists and is strictly a numeric type index
    if (state && typeof state.activeTooltipIndex === "number") {
      setHoveredIndex(state.activeTooltipIndex);
    } else {
      setHoveredIndex(null);
    }
  }}
  onMouseLeave={() => setHoveredIndex(null)}
>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
              dy={10}
            />

            {/* Resolved clipping: width increased, cleaner styles, appended degree sign */}
            <YAxis 
              width={36} 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => `${value}°`}
            />

            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />

            <Bar
              dataKey="temp"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            >
              {data.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  // Active bar stays highly opaque while ambient ones soft-fade out
                  fill="#22c55e"
                  fillOpacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                  className="transition-all duration-200 ease-in-out"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* Custom Minimalist Tooltip Component */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
          <span>Peak Temp:</span>
          <span className="text-base font-bold">{payload[0].value}°C</span>
        </div>
      </div>
    );
  }
  return null;
}
