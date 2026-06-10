"use client";

import { useState } from "react";

import SearchBar from "@/components/weather/SearchBar";
import HeroCard from "@/components/weather/HeroCard";

import Tabs from "@/components/tabs/Tabs";
import TabPanel from "@/components/tabs/TabPanel";

import CurrentChart from "@/components/charts/CurrentChart";
import ForecastChart from "@/components/charts/ForecastChart";
import HistoricalChart from "@/components/charts/HistoricalChart";
import AISummary from "@/components/ai/AISummary";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [activeTab, setActiveTab] = useState("today");

  // New isolated state to lock the AI trigger exclusively to the search click event
  const [aiCity, setAiCity] = useState("");

  const [currentData, setCurrentData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const tabs = [
    { label: "Today", value: "today" },
    { label: "Forecast", value: "forecast" },
    { label: "Historical", value: "historical" },
  ];

  const handleSearch = async () => {
    const targetCity = city.trim();
    if (!targetCity) return;

    try {
      setLoading(true);

      const [currentRes, forecastRes, historicalRes] =
        await Promise.all([
          fetch(`/api/weather/current?name=${encodeURIComponent(targetCity)}`),
          fetch(`/api/weather/forecast?name=${encodeURIComponent(targetCity)}`),
          fetch(`/api/weather/historical?name=${encodeURIComponent(targetCity)}`),
        ]);

      const current = await currentRes.json();
      const forecast = await forecastRes.json();
      const historical = await historicalRes.json();

      setCurrentData(current);
      setForecastData(forecast);
      setHistoricalData(historical);

      setSearchedCity(targetCity);

      // Lock the city string here. This is the ONLY time the AI can be invoked.
      setAiCity(targetCity);

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
          <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />
        </section>

        {/* Hero */}
        <section className="weather-hero mb-8">
          <HeroCard city={searchedCity} current={currentData?.current} />
        </section>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center text-slate-500 mb-8">
            Loading weather data...
          </div>
        )}

        {/* Tabs Wrapper */}
        <section className="weather-tabs">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
            {/* Today */}
            <TabPanel value="today" activeTab={activeTab}>
              <h2 className="text-lg font-semibold md:text-2xl mb-6 text-center">
                Today's Temperature
              </h2>
              {!loading && currentData && (
                <CurrentChart hourly={currentData?.hourly} />
              )}
            </TabPanel>

            {/* Forecast */}
            <TabPanel value="forecast" activeTab={activeTab}>
              <h2 className="text-lg font-semibold md:text-2xl mb-6 text-center">
                Next 7 Days Forecast
              </h2>
              {!loading && forecastData && (
                <ForecastChart daily={forecastData} />
              )}
            </TabPanel>

            {/* Historical */}
            <TabPanel value="historical" activeTab={activeTab}>
              <h2 className="text-lg font-semibold md:text-2xl mb-6 text-center">
                Previous 7 Days Weather
              </h2>
              {!loading && historicalData && (
                <HistoricalChart daily={historicalData?.daily} />
              )}
            </TabPanel>
          </Tabs>
        </section>

        {/* AI Summary Panel */}
        {aiCity && !loading && (
          <AISummary
            title="Weather Insights"
            prompt="Give some interesting facts about the climate and weather patterns."
            args={[aiCity]}
            triggerKey={aiCity} // Complete reference safety lock!
            wordLimit={120}
          />
        )}

      </div>
    </main>
  );
}
