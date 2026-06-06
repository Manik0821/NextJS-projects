"use client";
import { ResponsiveBar } from '@nivo/bar';
import MyWeatherChart from './forecast';
import './forecast.css';

// Sample weather data
const weatherData = [
  { day: 'Mon', high: 22, low: 14 },
  { day: 'Tue', high: 25, low: 15 },
  { day: 'Wed', high: 19, low: 11 },
  { day: 'Thu', high: 18, low: 10 },
  { day: 'Fri', high: 24, low: 13 },
  { day: 'Sat', high: 28, low: 18 },
  { day: 'Sun', high: 26, low: 17 },
];

const Forecast = () => (
    <div className="forecast-wrapper">
        <div className="chart-container">
        <MyWeatherChart /> 
        </div>
    </div>
);

export default Forecast;
