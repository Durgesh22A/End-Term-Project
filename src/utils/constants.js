/**
 * Popular destinations with coordinates for quick selection
 */
export const POPULAR_DESTINATIONS = [
  { name: 'Goa', lat: 15.2993, lon: 74.124, country: 'India' },
  { name: 'Manali', lat: 32.2432, lon: 77.1892, country: 'India' },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, country: 'India' },
  { name: 'Kerala', lat: 10.8505, lon: 76.2711, country: 'India' },
  { name: 'Udaipur', lat: 24.5854, lon: 73.7125, country: 'India' },
  { name: 'Rishikesh', lat: 30.0869, lon: 78.2676, country: 'India' },
  { name: 'Varanasi', lat: 25.3176, lon: 82.9739, country: 'India' },
  { name: 'Leh Ladakh', lat: 34.1526, lon: 77.5771, country: 'India' },
  { name: 'Bangkok', lat: 13.7563, lon: 100.5018, country: 'Thailand' },
  { name: 'Bali', lat: -8.3405, lon: 115.092, country: 'Indonesia' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'UAE' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK' },
  { name: 'New York', lat: 40.7128, lon: -74.006, country: 'USA' },
];

/**
 * Supported currencies (common ones first)
 */
export const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
];

/**
 * Trip status based on dates
 */
export function getTripStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return { label: 'Upcoming', variant: 'indigo' };
  if (now >= start && now <= end) return { label: 'Active', variant: 'green' };
  return { label: 'Completed', variant: 'teal' };
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate, endDate) {
  const options = { month: 'short', day: 'numeric' };
  const start = new Date(startDate).toLocaleDateString('en-IN', options);
  const end = new Date(endDate).toLocaleDateString('en-IN', { ...options, year: 'numeric' });
  return `${start} – ${end}`;
}

/**
 * Calculate days remaining or days of trip
 */
export function getDaysInfo(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  if (now < start) {
    const daysUntil = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    return { totalDays, daysUntil, daysElapsed: 0, label: `Starts in ${daysUntil}d` };
  }
  
  if (now <= end) {
    const daysElapsed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    return { totalDays, daysUntil: 0, daysElapsed, label: `Day ${daysElapsed} of ${totalDays}` };
  }
  
  return { totalDays, daysUntil: 0, daysElapsed: totalDays, label: `${totalDays} days` };
}
