import { getWeatherInfo } from '../../utils/weatherCodes';
import { CloudRain } from 'lucide-react';
import './WeatherWidget.css';

export default function WeatherWidget({ forecast, loading, error }) {
  if (loading) {
    return (
      <div className="weather-loading">
        <div className="skeleton-line skeleton-wide" />
        <div className="weather-days-skeleton">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="skeleton-card" style={{ padding: '1rem', minWidth: '80px' }}>
              <div className="skeleton-line skeleton-narrow" />
              <div className="skeleton-line skeleton-medium" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-error">
        <CloudRain size={24} />
        <span>Weather unavailable</span>
      </div>
    );
  }

  if (!forecast || !forecast.time) {
    return (
      <div className="weather-error">
        <span>No forecast data</span>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-scroll">
        {forecast.time.map((date, index) => {
          const weather = getWeatherInfo(forecast.weathercode[index]);
          const maxTemp = Math.round(forecast.temperature_2m_max[index]);
          const minTemp = Math.round(forecast.temperature_2m_min[index]);
          const dayName = new Date(date).toLocaleDateString('en-IN', { weekday: 'short' });
          const dayNum = new Date(date).getDate();

          return (
            <div key={date} className="weather-day" style={{ animationDelay: `${index * 60}ms` }}>
              <span className="weather-day-name">{index === 0 ? 'Today' : dayName}</span>
              <span className="weather-day-num">{dayNum}</span>
              <span className="weather-icon">{weather.icon}</span>
              <div className="weather-temps">
                <span className="weather-max">{maxTemp}°</span>
                <span className="weather-min">{minTemp}°</span>
              </div>
              <span className="weather-desc">{weather.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
