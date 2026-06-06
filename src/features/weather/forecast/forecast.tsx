"use client";

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

// FIXED: Cleaned up the 'bandwidth' typo so the data type matches the BarDatum schema perfectly
const weatherData = [
  { day: 'Mon', high: 22, low: 14 },
  { day: 'Tue', high: 25, low: 15 },
  { day: 'Wed', high: 19, low: 11 },
  { day: 'Thu', high: 18, low: 10 },
  { day: 'Fri', high: 24, low: 13 }, // Cleaned uniform properties
  { day: 'Sat', high: 28, low: 18 },
  { day: 'Sun', high: 26, low: 17 },
];

const MyWeatherChart = () => (
  <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow-sm">
    <ResponsiveBar
      data={weatherData}
      keys={['low', 'high']}
      indexBy="day"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }} 
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Day of Week',
        legendPosition: 'middle',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Temperature (°C)',
        legendPosition: 'middle',
        legendOffset: -40
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      role="application"
      ariaLabel="Nivo weather chart example"
    />
  </div>
);

export default MyWeatherChart;
