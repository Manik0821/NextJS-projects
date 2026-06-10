"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, CalendarDays, Thermometer } from "lucide-react";

interface Props {
  daily: any;
}

export default function ForecastChart({ daily }: Props) {
  if (!daily || !daily.time) return null;

  const data = daily.time.map(
    (date: string, idx: number) => ({
      day: new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      max: Math.round(daily.temperature_2m_max[idx]),
      min: Math.round(daily.temperature_2m_min[idx]),
    })
  );

  // Calculate quick metrics for the summary chips
  const absoluteMax = Math.max(...data.map((d: any) => d.max));
  const absoluteMin = Math.min(...data.map((d: any) => d.min));

  return (
    <div className="forecast-chart flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:gap-6 md:p-6">
      
      {/* Visual Header & Summary Chips */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500">Trend Analysis</h3>
            <p className="text-xs text-slate-400">7-day temperature fluctuations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Max Peak Chip */}
          <div className="flex items-center gap-1.5 rounded-lg bg-rose-50/70 px-2.5 py-1.5 text-xs font-semibold text-rose-600 border border-rose-100">
            <ArrowUpRight className="h-4 w-4" />
            <span>Peak: {absoluteMax}°</span>
          </div>
          {/* Min Peak Chip */}
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50/70 px-2.5 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100">
            <ArrowDownRight className="h-4 w-4" />
            <span>Low: {absoluteMin}°</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-[300px] w-full md:h-[400px]">
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart 
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
              dy={10}
            />

            {/* Resolved clipping: width increased, added padding, and formatted labels */}
            <YAxis 
              width={36} 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => `${value}°`}
            />

            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            <Area
              type="monotone"
              dataKey="max"
              stroke="#ef4444"
              strokeWidth={2.5}
              fill="url(#colorMax)"
            />

            <Area
              type="monotone"
              dataKey="min"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#colorMin)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* Enhanced Custom Tooltip Design */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white/95 p-3 shadow-xl backdrop-blur-sm min-w-[120px]">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-rose-600">
            <span className="flex items-center gap-1">
              <Thermometer className="h-3.5 w-3.5" /> High
            </span>
            <span>{payload[0].value}°C</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-blue-600">
            <span className="flex items-center gap-1">
              <Thermometer className="h-3.5 w-3.5" /> Low
            </span>
            <span>{payload[1].value}°C</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}