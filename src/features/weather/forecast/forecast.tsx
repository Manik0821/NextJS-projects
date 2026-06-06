import { ResponsiveBar } from '@nivo/bar';

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

const MyWeatherChart = () => (
  <div style={{ height: '100%' }}>
    <ResponsiveBar
      data={weatherData}
      keys={['low', 'high']}
      indexBy="day"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }} // Or use a custom color like ['#4fc3f7', '#ffb74d']
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