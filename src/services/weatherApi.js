const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch 7-day weather forecast for given coordinates
 */
export async function fetchForecast(lat, lon) {
  if (!lat || !lon) return null;
  
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max',
    timezone: 'Asia/Kolkata',
    forecast_days: '7',
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error('Failed to fetch weather data');
  
  const data = await response.json();
  return data.daily;
}
