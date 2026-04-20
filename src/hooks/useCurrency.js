import { useState, useEffect } from 'react';
import { convertCurrency, fetchRates } from '../services/currencyApi';

/**
 * Custom hook for currency conversion using Frankfurter API
 * Demonstrates useEffect with cleanup and conditional fetching
 */
export function useCurrency(amount, from, to) {
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!amount || !from || !to || from === to) {
      setConvertedAmount(amount || 0);
      setRate(1);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    convertCurrency(amount, from, to)
      .then((result) => {
        if (!cancelled) {
          setConvertedAmount(result);
          setRate(result / amount);
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
  }, [amount, from, to]);

  return { convertedAmount, rate, loading, error };
}

/**
 * Hook to get all rates for a base currency
 */
export function useRates(baseCurrency) {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!baseCurrency) return;

    let cancelled = false;
    setLoading(true);

    fetchRates(baseCurrency)
      .then((data) => {
        if (!cancelled) {
          setRates(data);
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
  }, [baseCurrency]);

  return { rates, loading, error };
}
