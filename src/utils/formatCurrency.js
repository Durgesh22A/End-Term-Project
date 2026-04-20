/**
 * Format number as currency string
 */
export function formatCurrency(amount, currency = 'INR') {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  try {
    return formatter.format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format number in short form (1K, 1L, 1Cr for INR)
 */
export function formatShortCurrency(amount, currency = 'INR') {
  if (currency === 'INR') {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  }
  
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toString();
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency = 'INR') {
  const symbols = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥',
    AUD: 'A$', CAD: 'C$', SGD: 'S$', THB: '฿', AED: 'د.إ',
  };
  return symbols[currency] || currency;
}
