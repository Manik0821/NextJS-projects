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

interface Props {
  daily: any;
}

export default function ForecastChart({ daily }: Props) {
  if (!daily) return null;

  const data = daily.time.map(
    (date: string, idx: number) => ({
      day: new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      max: daily.temperature_2m_max[idx],
      min: daily.temperature_2m_min[idx],
    })
  );

  return (
    <div className="forecast-chart w-full h-[420px] md:h-[550px]" >

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="day"
            tick={{
              fontSize: 12,
            }}
          />

          <YAxis width={20} />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="max"
            stroke="#ef4444"
            fillOpacity={0.15}
            fill="#ef4444"
          />

          <Area
            type="monotone"
            dataKey="min"
            stroke="#3b82f6"
            fillOpacity={0.15}
            fill="#3b82f6"
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}