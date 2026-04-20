/**
 * Expense categories with emoji icons and colors
 */
export const CATEGORIES = {
  food: { emoji: '🍽️', label: 'Food & Drinks', color: '#f97316' },
  stay: { emoji: '🏨', label: 'Accommodation', color: '#8b5cf6' },
  transport: { emoji: '🚗', label: 'Transport', color: '#3b82f6' },
  activities: { emoji: '🎭', label: 'Activities', color: '#14b8a6' },
  shopping: { emoji: '🛍️', label: 'Shopping', color: '#ec4899' },
  other: { emoji: '📱', label: 'Other', color: '#6b7280' },
};

/**
 * Get category info by key
 */
export function getCategoryInfo(key) {
  return CATEGORIES[key] || CATEGORIES.other;
}

/**
 * Get all category keys
 */
export function getCategoryKeys() {
  return Object.keys(CATEGORIES);
}
