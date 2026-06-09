"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";

interface Props {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
  };
}

function CustomTooltip({
  active,
  payload,
  label,
}: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg border border-slate-100">

      <p className="text-sm font-semibold mb-3">
        {label}
      </p>

      <div className="space-y-2">

        <div className="flex items-center gap-2">
          <Thermometer
            size={16}
            className="text-blue-600"
          />

          <span className="text-sm">
            {payload[2]?.value}°C
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Droplets
            size={16}
            className="text-cyan-500"
          />

          <span className="text-sm">
            {payload[0]?.value}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Wind
            size={16}
            className="text-green-600"
          />

          <span className="text-sm">
            {payload[1]?.value} km/h
          </span>
        </div>

      </div>
    </div>
  );
}

export default function CurrentChart({
  hourly,
}: Props) {

  if (
    !hourly ||
    !hourly.time
  ) {
    return (
      <div className="text-center text-slate-500">
        No hourly data available
      </div>
    );
  }

  const data = hourly.time
    .map((time, idx) => ({
      time: time.slice(11, 16),

      temperature:
        hourly.temperature_2m[idx],

      humidity:
        hourly.relative_humidity_2m[idx],

      wind:
        hourly.wind_speed_10m[idx],
    }))
    .filter((_, idx) => idx % 2 === 0);

  return (
    <div className="current-chart w-full">

      {/* Legend */}

      <div className="current-chart-legend flex justify-center gap-6 mb-5">

        <div className="flex items-center gap-2 text-sm">
          <Thermometer
            size={18}
            className="text-blue-600"
          />

          Temperature
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Droplets
            size={18}
            className="text-cyan-500"
          />

          Humidity
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Wind
            size={18}
            className="text-green-600"
          />

          Wind
        </div>

      </div>

      <div className="current-chart-wrapper h-[430px] md:h-[550px]">

        <ResponsiveContainer
          width="100%"
          height="80%"
        >
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 2"
            />

            <XAxis
              dataKey="time"
              tick={{
                fontSize: 12,
              }}
            />

            <YAxis
              width={30}
              tick={{
                fontSize: 12,
              }}
              domain={[
                (dataMin: number) =>
                  Math.floor(dataMin - 2),

                (dataMax: number) =>
                  Math.ceil(dataMax + 2),
              ]}
            />

            <Tooltip
              content={<CustomTooltip />}
            />

            {/* Humidity Area */}

            <Area
              type="monotone"
              dataKey="humidity"
              fill="#67e8f9"
              fillOpacity={0.15}
              stroke="#06b6d4"
              strokeWidth={2}
            />

            {/* Wind Bars */}

            <Bar
              dataKey="wind"
              fill="#86efac"
              radius={[8, 8, 0, 0]}
              barSize={10}
            />

            {/* Temperature Line */}

            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#2563eb"
              strokeWidth={4}
              dot={false}
              activeDot={{
                r: 6,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}