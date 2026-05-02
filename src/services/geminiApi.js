import { popularDestinations, findFallbackDestination } from "../utils/fallbackDestinations";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_VERSION = "v6";

(function clearOldCache() {
  try {
    if (localStorage.getItem('explore_cache_version') !== CACHE_VERSION) {
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith('explore_')) localStorage.removeItem(k);
      }
      localStorage.setItem('explore_cache_version', CACHE_VERSION);
    }
  } catch { }
})();

function getCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) { localStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}

function setCached(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    for (const k of Object.keys(localStorage)) { if (k.startsWith('explore_')) localStorage.removeItem(k); }
    try { localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() })); } catch { }
  }
}

function stripHtml(str = '') {
  return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function toTitleCase(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function findKnownDestination(query) {
  const q = query.toLowerCase().trim();
  return popularDestinations.find(d =>
    d.name.toLowerCase() === q ||
    d.id === q.replace(/\s+/g, '-') ||
    d.name.toLowerCase().startsWith(q) ||
    q.startsWith(d.name.toLowerCase())
  ) || null;
}

async function buildGuideFromWikipedia(destination) {
  const displayName = toTitleCase(destination.trim());

  const signal = AbortSignal.timeout(8000);

  const [summaryResult, attractionResult, cuisineResult] = await Promise.allSettled([
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination)}`,
      { signal }
    ).then(r => r.ok ? r.json() : null),
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(destination + ' tourist attraction temple museum fort palace garden')}&format=json&origin=*&srlimit=8`,
      { signal }
    ).then(r => r.ok ? r.json() : null),
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(destination + ' cuisine food dish recipe local traditional')}&format=json&origin=*&srlimit=6`,
      { signal }
    ).then(r => r.ok ? r.json() : null),
  ]);

  let overview = `${displayName} is a remarkable destination with a rich cultural heritage, unique local traditions, and attractions that captivate every kind of traveler.`;
  let country = '';

  const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null;
  if (summary?.extract) {
    const sentences = summary.extract.replace(/\n/g, ' ').split(/(?<=[.!?])\s+/);
    overview = sentences.slice(0, 2).join(' ').trim();
    if (!overview.endsWith('.')) overview += '.';
  }
  if (summary?.description) {
    country = summary.description.split(',').map(s => s.trim()).pop() || '';
  }

  const attractionData = attractionResult.status === 'fulfilled' ? attractionResult.value : null;
  const rawAttractions = (attractionData?.query?.search || [])
    .filter(r => r.title.toLowerCase() !== destination.toLowerCase())
    .slice(0, 5);

  const GENERIC_ATTRACTIONS = [
    { name: `${displayName} Old Town`, description: `The historic heart of ${displayName} with traditional architecture, cultural heritage, and bustling local life.`, visit_time: '2-3 hours', entry_fee: 'Free' },
    { name: `${displayName} Museum`, description: `The main city museum showcasing the history, arts, and archaeological heritage of the ${displayName} region.`, visit_time: '2 hours', entry_fee: 'Varies' },
    { name: `${displayName} Local Market`, description: `A vibrant market where you can experience local life, pick up handicrafts, and taste street food.`, visit_time: '1-2 hours', entry_fee: 'Free' },
    { name: `${displayName} Place of Worship`, description: `An important religious and cultural site, offering a glimpse into the spiritual heart of the community.`, visit_time: '1 hour', entry_fee: 'Free' },
    { name: `${displayName} Scenic Viewpoint`, description: `A beautiful vantage point or natural area offering panoramic views of the surrounding landscape.`, visit_time: '1-2 hours', entry_fee: 'Free' },
  ];

  const top_attractions = rawAttractions.map(r => ({
    name: r.title,
    description: stripHtml(r.snippet).substring(0, 160).trim().replace(/\.\.\.$/, '') + '.',
    visit_time: '1-3 hours',
    entry_fee: 'Varies',
    search_term: r.title,
  }));

  while (top_attractions.length < 5) {
    const g = GENERIC_ATTRACTIONS[top_attractions.length];
    top_attractions.push({ ...g, search_term: g.name });
  }

  const cuisineData = cuisineResult.status === 'fulfilled' ? cuisineResult.value : null;
  const rawCuisine = (cuisineData?.query?.search || [])
    .filter(r => r.title.toLowerCase() !== destination.toLowerCase())
    .slice(0, 4);

  const GENERIC_CUISINE = [
    { name: `${displayName} Signature Dish`, description: `A traditional recipe unique to the ${displayName} region, made with local ingredients and age-old techniques.`, price_range: 'Local rates' },
    { name: 'Street Food Snacks', description: `Quick, flavorful bites from roadside stalls — a delicious window into everyday local food culture.`, price_range: 'Budget-friendly' },
    { name: 'Traditional Dessert', description: `A beloved local sweet made during festivals and celebrations, often enjoyed with tea or coffee.`, price_range: 'Budget-friendly' },
    { name: 'Regional Specialty', description: `A dish or drink that defines the culinary identity of this region, often found only here.`, price_range: 'Local rates' },
  ];

  const local_cuisine = rawCuisine.map(r => ({
    name: r.title,
    description: stripHtml(r.snippet).substring(0, 130).trim().replace(/\.\.\.$/, '') + '.',
    price_range: 'Varies',
    search_term: r.title,
  }));

  while (local_cuisine.length < 4) {
    const g = GENERIC_CUISINE[local_cuisine.length];
    local_cuisine.push({ ...g, search_term: g.name });
  }

  return {
    destination_name: displayName,
    country: country || 'World',
    tagline: `Discover the heart and soul of ${displayName}`,
    overview,
    top_attractions,
    local_cuisine,
    budget_estimate: {
      budget: 'Budget options available',
      moderate: 'Mid-range comfort',
      luxury: 'Premium experiences',
      currency: 'Local currency',
    },
    best_time: 'Spring (March–May) and autumn (September–November) are generally the best months to visit most destinations worldwide.',
    culture_tips: [
      'Learn a few basic greetings in the local language — it goes a long way.',
      'Research local dress codes, especially for religious sites.',
      'Carry some local cash as smaller vendors may not accept cards.',
      'Respect local customs and traditions, particularly during festivals.',
    ],
    safety_notes: `Exercise standard travel precautions in ${displayName}: keep valuables secure, use registered transport, and stay aware of your surroundings.`,
  };
}

export async function generateTravelSuggestions(destination) {
  if (!destination?.trim()) throw new Error('EMPTY_DESTINATION');

  const cacheKey = `explore_${destination.toLowerCase().trim().replace(/\s+/g, '_')}`;

  const cached = getCached(cacheKey);
  if (cached) return cached;

  const known = findKnownDestination(destination);
  if (known) {
    setCached(cacheKey, known);
    return known;
  }

  try {
    const guide = await buildGuideFromWikipedia(destination);
    if (guide) {
      setCached(cacheKey, guide);
      return guide;
    }
  } catch (err) {
    console.warn('[Travel] Wikipedia failed:', err.message);
  }

  return findFallbackDestination(destination);
}

export default generateTravelSuggestions;
