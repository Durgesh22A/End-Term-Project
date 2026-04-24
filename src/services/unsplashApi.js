/**
 * Unsplash API service for fetching destination and attraction photos.
 * Falls back to curated placeholder images when the API is unavailable.
 */

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// Vibrant placeholder gradients as fallback when no image is available
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
];

/**
 * Search Unsplash for photos matching a query
 * @param {string} query - Search term
 * @param {number} perPage - Number of results (default 1)
 * @returns {object|null} Photo data with urls, or null on failure
 */
export async function searchPhotos(query, perPage = 1) {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return null;
  }

  // Check sessionStorage cache
  const cacheKey = `unsplash_${query.toLowerCase().trim()}_${perPage}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch { /* ignore */ }
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: perPage,
      orientation: 'landscape',
      content_filter: 'high',
    });

    const response = await fetch(`${UNSPLASH_API_URL}?${params}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      console.warn(`Unsplash API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const results = data.results.map(photo => ({
      id: photo.id,
      url_regular: photo.urls?.regular,
      url_small: photo.urls?.small,
      url_thumb: photo.urls?.thumb,
      alt: photo.alt_description || query,
      photographer: photo.user?.name,
      photographer_url: photo.user?.links?.html,
    }));

    // Cache results
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(results));
    } catch { /* storage full */ }

    return results;
  } catch (error) {
    console.warn('Unsplash fetch error:', error.message);
    return null;
  }
}

/**
 * Fetch a single photo for a destination or attraction
 * @param {string} searchTerm - What to search for
 * @returns {object} { url, alt, photographer, gradient }
 */
export async function fetchPlacePhoto(searchTerm) {
  const results = await searchPhotos(searchTerm, 1);

  if (results && results.length > 0) {
    return {
      url: results[0].url_regular,
      urlSmall: results[0].url_small,
      alt: results[0].alt,
      photographer: results[0].photographer,
      photographerUrl: results[0].photographer_url,
      isPlaceholder: false,
    };
  }

  // Fallback: Use LoremFlickr for real photos based on search term
  // LoremFlickr works best with comma-separated tags instead of spaces
  const tags = searchTerm.toLowerCase().replace(/\s+/g, ',');
  const gradientIndex = Math.abs(hashString(searchTerm)) % PLACEHOLDER_GRADIENTS.length;
  const url = `https://loremflickr.com/800/600/${tags},travel`;
  const urlSmall = `https://loremflickr.com/400/300/${tags},travel`;

  console.log(`[Photo Service] Fetching for: "${searchTerm}" | URL: ${url}`);

  return {
    url,
    urlSmall,
    alt: searchTerm,
    photographer: 'LoremFlickr',
    photographerUrl: 'https://loremflickr.com',
    gradient: PLACEHOLDER_GRADIENTS[gradientIndex],
    isPlaceholder: false,
  };
}

/**
 * Fetch multiple photos for an array of items (attractions, cuisine, etc.)
 * @param {Array} items - Array of objects with a search_term or name property
 * @returns {Array} Same items with added `photo` property
 */
export async function fetchPhotosForItems(items) {
  if (!items || items.length === 0) return [];

  const photoPromises = items.map(item => {
    const term = item.search_term || item.name;
    return fetchPlacePhoto(term);
  });

  const photos = await Promise.allSettled(photoPromises);

  return items.map((item, i) => ({
    ...item,
    photo: photos[i].status === 'fulfilled' ? photos[i].value : {
      url: null,
      gradient: PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length],
      isPlaceholder: true,
    },
  }));
}

// Simple string hash for deterministic gradient selection
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}
