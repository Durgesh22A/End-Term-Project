const BASE_URL = 'https://api.frankfurter.app';

let cachedRates = {};
let lastFetchBase = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Fallback rates in case API is blocked by ad blocker
const FALLBACK_RATES = {
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.81, AUD: 0.018, CAD: 0.016, SGD: 0.016, THB: 0.41, AED: 0.044, MYR: 0.055 },
  USD: { INR: 83.5, EUR: 0.92, GBP: 0.79, JPY: 151.5, AUD: 1.53, CAD: 1.37, SGD: 1.34, THB: 34.8, AED: 3.67, MYR: 4.65 },
  EUR: { INR: 90.8, USD: 1.09, GBP: 0.86, JPY: 164.5, AUD: 1.66, CAD: 1.49, SGD: 1.46, THB: 37.8, AED: 3.99, MYR: 5.05 },
};

/**
 * Fetch latest exchange rates for a base currency
 */
export async function fetchRates(baseCurrency = 'INR') {
  const now = Date.now();
  
  if (lastFetchBase === baseCurrency && now - lastFetchTime < CACHE_DURATION && Object.keys(cachedRates).length > 0) {
    return cachedRates;
  }

  try {
    const response = await fetch(`${BASE_URL}/latest?base=${baseCurrency}`);
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    
    const data = await response.json();
    cachedRates = data.rates;
    lastFetchBase = baseCurrency;
    lastFetchTime = now;
    
    return cachedRates;
  } catch (error) {
    console.warn('Currency API unavailable, using fallback rates');
    return FALLBACK_RATES[baseCurrency] || {};
  }
}

/**
 * Convert an amount from one currency to another
 */
export async function convertCurrency(amount, from, to) {
  if (from === to) return amount;
  
  try {
    const response = await fetch(`${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
    if (!response.ok) throw new Error('Currency conversion failed');
    
    const data = await response.json();
    return data.rates[to];
  } catch (error) {
    // Fallback: use hardcoded rates
    console.warn('Currency API blocked, using fallback conversion');
    const rates = FALLBACK_RATES[from];
    if (rates && rates[to]) {
      return amount * rates[to];
    }
    return null;
  }
}

/**
 * Get list of supported currencies
 */
export async function fetchCurrencies() {
  try {
    const response = await fetch(`${BASE_URL}/currencies`);
    if (!response.ok) throw new Error('Failed to fetch currencies');
    return response.json();
  } catch {
    return {};
  }
}
