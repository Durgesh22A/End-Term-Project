const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';

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

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

async function fetchWikipediaImage(searchTerm) {
  try {
    const searchParams = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: searchTerm,
      format: 'json',
      origin: '*',
      srlimit: 3,
      srnamespace: 0,
    });

    const searchRes = await fetch(`${WIKIPEDIA_API}?${searchParams}`);
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();

    const results = searchData.query?.search;
    if (!results || results.length === 0) return null;

    const pageTitle = results[0].title;

    const imageParams = new URLSearchParams({
      action: 'query',
      titles: pageTitle,
      prop: 'pageimages',
      format: 'json',
      origin: '*',
      pithumbsize: 800,
      piprop: 'thumbnail|original',
    });

    const imageRes = await fetch(`${WIKIPEDIA_API}?${imageParams}`);
    if (!imageRes.ok) return null;
    const imageData = await imageRes.json();

    const pages = imageData.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0];
    return page?.original?.source || page?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

async function searchUnsplashPhotos(query, perPage = 1) {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  const cacheKey = `unsplash_${query.toLowerCase().trim()}_${perPage}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try { return JSON.parse(cached); } catch { }
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: perPage,
      orientation: 'landscape',
      content_filter: 'high',
    });

    const response = await fetch(`${UNSPLASH_API_URL}?${params}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    const results = data.results.map(photo => ({
      id: photo.id,
      url_regular: photo.urls?.regular,
      url_small: photo.urls?.small,
      alt: photo.alt_description || query,
      photographer: photo.user?.name,
      photographer_url: photo.user?.links?.html,
    }));

    try { sessionStorage.setItem(cacheKey, JSON.stringify(results)); } catch { }

    return results;
  } catch {
    return null;
  }
}

export async function fetchPlacePhoto(searchTerm) {
  if (!searchTerm) {
    return { url: null, gradient: PLACEHOLDER_GRADIENTS[0], isPlaceholder: true };
  }

  const gradientIndex = Math.abs(hashString(searchTerm)) % PLACEHOLDER_GRADIENTS.length;

  const wikiUrl = await fetchWikipediaImage(searchTerm);
  if (wikiUrl) {
    return {
      url: wikiUrl,
      urlSmall: wikiUrl,
      alt: searchTerm,
      photographer: 'Wikipedia / Wikimedia Commons',
      photographerUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`,
      gradient: PLACEHOLDER_GRADIENTS[gradientIndex],
      isPlaceholder: false,
    };
  }

  const unsplashResults = await searchUnsplashPhotos(searchTerm, 1);
  if (unsplashResults && unsplashResults.length > 0) {
    return {
      url: unsplashResults[0].url_regular,
      urlSmall: unsplashResults[0].url_small,
      alt: unsplashResults[0].alt,
      photographer: unsplashResults[0].photographer,
      photographerUrl: unsplashResults[0].photographer_url,
      gradient: PLACEHOLDER_GRADIENTS[gradientIndex],
      isPlaceholder: false,
    };
  }

  return {
    url: null,
    urlSmall: null,
    alt: searchTerm,
    photographer: null,
    photographerUrl: null,
    gradient: PLACEHOLDER_GRADIENTS[gradientIndex],
    isPlaceholder: true,
  };
}

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

export async function searchPhotos(query, perPage = 1) {
  return searchUnsplashPhotos(query, perPage);
}
