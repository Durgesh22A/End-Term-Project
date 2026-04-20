/**
 * WMO Weather interpretation codes mapped to icons and descriptions
 * Source: https://open-meteo.com/en/docs
 */
export const WEATHER_CODES = {
  0: { icon: '☀️', description: 'Clear sky' },
  1: { icon: '🌤️', description: 'Mainly clear' },
  2: { icon: '⛅', description: 'Partly cloudy' },
  3: { icon: '☁️', description: 'Overcast' },
  45: { icon: '🌫️', description: 'Foggy' },
  48: { icon: '🌫️', description: 'Rime fog' },
  51: { icon: '🌦️', description: 'Light drizzle' },
  53: { icon: '🌦️', description: 'Moderate drizzle' },
  55: { icon: '🌦️', description: 'Dense drizzle' },
  56: { icon: '🌧️', description: 'Freezing drizzle' },
  57: { icon: '🌧️', description: 'Dense freezing drizzle' },
  61: { icon: '🌧️', description: 'Slight rain' },
  63: { icon: '🌧️', description: 'Moderate rain' },
  65: { icon: '🌧️', description: 'Heavy rain' },
  66: { icon: '🌧️', description: 'Freezing rain' },
  67: { icon: '🌧️', description: 'Heavy freezing rain' },
  71: { icon: '🌨️', description: 'Slight snow' },
  73: { icon: '🌨️', description: 'Moderate snow' },
  75: { icon: '❄️', description: 'Heavy snow' },
  77: { icon: '🌨️', description: 'Snow grains' },
  80: { icon: '🌧️', description: 'Rain showers' },
  81: { icon: '🌧️', description: 'Moderate showers' },
  82: { icon: '⛈️', description: 'Violent showers' },
  85: { icon: '🌨️', description: 'Snow showers' },
  86: { icon: '🌨️', description: 'Heavy snow showers' },
  95: { icon: '⛈️', description: 'Thunderstorm' },
  96: { icon: '⛈️', description: 'Thunderstorm with hail' },
  99: { icon: '⛈️', description: 'Thunderstorm with heavy hail' },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { icon: '🌤️', description: 'Unknown' };
}
