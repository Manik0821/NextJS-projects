"use client";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  daily: any;
}

export default function HistoricalChart({
  daily,
}: Props) {
  if (!daily) return null;

  const data = daily.time.map(
    (date: string, idx: number) => ({
      day: new Date(date).toLocaleDateString(
        "en-US",
        {
          weekday: "short",
        }
      ),
      temp: daily.temperature_2m_max[idx],
    })
  );

  return (
    <div className="historical-chart w-full h-[420px] md:h-[550px]" >

      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
  dataKey="day"
  tick={{
    fontSize: 12,
  }}
/>

          <YAxis width={20}/>

          <Tooltip />

          <Bar
  dataKey="temp"
  fill="#22c55e"
  radius={[8, 8, 0, 0]}
/>
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}