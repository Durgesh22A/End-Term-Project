import { useState, useEffect } from 'react';
import { fetchForecast } from '../services/weatherApi';

/**
 * Custom hook to fetch 7-day weather forecast
 * Demonstrates useEffect with conditional data fetching
 */
export function useWeather(lat, lon) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) {
      setForecast(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchForecast(lat, lon)
      .then((data) => {
        if (!cancelled) {
          setForecast(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [lat, lon]);

  return { forecast, loading, error };
}
