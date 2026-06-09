"use client";

import { useState } from "react";

import SearchBar from "@/components/weather/SearchBar";
import HeroCard from "@/components/weather/HeroCard";

import Tabs from "@/components/tabs/Tabs";
import TabPanel from "@/components/tabs/TabPanel";

import CurrentChart from "@/components/charts/CurrentChart";
import ForecastChart from "@/components/charts/ForecastChart";
import HistoricalChart from "@/components/charts/HistoricalChart";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("London");
  const [activeTab, setActiveTab] = useState("today");

  const [currentData, setCurrentData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      label: "Today",
      value: "today",
    },
    {
      label: "Forecast",
      value: "forecast",
    },
    {
      label: "Historical",
      value: "historical",
    },
  ];

  const handleSearch = async () => {
    if (!city.trim()) return;

    try {
      setLoading(true);

      const [currentRes, forecastRes, historicalRes] =
        await Promise.all([
          fetch(`/api/weather/current?name=${city}`),
          fetch(`/api/weather/forecast?name=${city}`),
          fetch(`/api/weather/historical?name=${city}`),
        ]);

      const current = await currentRes.json();
      const forecast = await forecastRes.json();
      const historical = await historicalRes.json();

      setCurrentData(current);
      setForecastData(forecast);
      setHistoricalData(historical);

      setSearchedCity(city);
      setCity("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="weather-page min-h-screen bg-slate-100">
      <div className="weather-page-container mx-auto max-w-7xl px-4 py-8">

        {/* Header */}
        <section className="weather-header mb-8 text-center">
          <h1 className="weather-title text-3xl font-bold md:text-5xl">
            Weather Dashboard
          </h1>

          <p className="weather-subtitle mt-3 text-sm text-slate-500 md:text-base">
            Search any city to view current, forecast and historical weather.
          </p>
        </section>

        {/* Search */}
        <section className="weather-search mb-8">
          <SearchBar
            city={city}
            setCity={setCity}
            onSearch={handleSearch}
          />
        </section>

        {/* Hero */}
        <section className="weather-hero mb-8">
          <HeroCard
            city={searchedCity}
            current={currentData?.current}
          />
        </section>

        {/* Loading */}
        {loading && (
          <div className="text-center text-slate-500 mb-8">
            Loading weather data...
          </div>
        )}

        {/* Tabs */}
        {!loading && (
          <section className="weather-tabs">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            >
              {/* Today */}
              <TabPanel
                value="today"
                activeTab={activeTab}
              >
                <h2 className="text-lg font-semibold md:text-2xl mb-6 text-center">
                  Today's Temperature
                </h2>

                <CurrentChart
                  hourly={currentData?.hourly}
                />
              </TabPanel>

              {/* Forecast */}
              <TabPanel
                value="forecast"
                activeTab={activeTab}
              >
                <h2 className="text-lg font-semibold md:text-2xl mb-6 text-center">
                  Next 7 Days Forecast
                </h2>

                <ForecastChart
                  daily={forecastData}
                />
              </TabPanel>

              {/* Historical */}
              <TabPanel
                value="historical"
                activeTab={activeTab}
              >
                <h2 className="text-lg font-semibold md:text-2xl mb-6 text-center">
                  Previous 7 Days Weather
                </h2>

                <HistoricalChart
                  daily={historicalData?.daily}
                />
              </TabPanel>
            </Tabs>
          </section>
        )}
      </div>
    </main>
  );
}