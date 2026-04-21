/**
 * Google Gemini AI API service for generating travel destination content.
 * Uses Gemini 2.0 Flash with structured JSON output.
 * Includes retry logic for rate limits (429) with exponential backoff.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Generate travel suggestions for a destination using Gemini AI
 * @param {string} destination - City or country name
 * @returns {object} Structured travel data
 * @throws {Error} If API key is missing or all retries fail
 */
export async function generateTravelSuggestions(destination) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  // Check sessionStorage cache first
  const cacheKey = `explore_${destination.toLowerCase().trim()}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch { /* ignore invalid cache */ }
  }

  const prompt = `You are an expert travel guide. Generate comprehensive travel information for "${destination}".

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):

{
  "destination_name": "Full official name of the place",
  "country": "Country name",
  "tagline": "A catchy 5-8 word description of the destination vibe",
  "overview": "2-3 sentence engaging overview of the destination highlighting what makes it special",
  "top_attractions": [
    {
      "name": "Exact name of the attraction",
      "description": "2-3 sentence description: why it's special, what to see, and what makes it unique",
      "visit_time": "Recommended duration (e.g., '2-3 hours')",
      "entry_fee": "Entry fee with currency symbol (e.g., '$15' or 'Free')",
      "search_term": "Best search term to find a photo of this place on Unsplash"
    }
  ],
  "local_cuisine": [
    {
      "name": "Dish name",
      "description": "What makes this dish special and where to find it",
      "price_range": "Price range with currency (e.g., '$5-10')",
      "search_term": "Best search term to find a photo of this dish"
    }
  ],
  "budget_estimate": {
    "budget": "Daily budget for budget travelers (e.g., '$30-50/day')",
    "moderate": "Daily budget for moderate travelers",
    "luxury": "Daily budget for luxury travelers",
    "currency": "Local currency code (e.g., 'USD', 'EUR')"
  },
  "best_time": "Best months to visit and why, in 1-2 sentences",
  "culture_tips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "safety_notes": "One paragraph about safety considerations"
}

Requirements:
- Include exactly 5 top attractions (the most iconic and must-visit ones)
- Include exactly 4 local cuisine items (most famous local dishes)
- Include exactly 4 culture tips
- All prices should include the local currency symbol
- Be factually accurate with real places and real prices
- The search_term should be specific enough to find relevant photos (e.g., "Eiffel Tower Paris" not just "tower")`;

  // Retry logic with exponential backoff
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [2000, 8000, 20000];

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_DELAYS[attempt - 1];
      console.log(`Gemini retry ${attempt}/${MAX_RETRIES} after ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
    }

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          throw new Error('GEMINI_EMPTY_RESPONSE');
        }

        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);

        // Cache the result
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
        } catch { /* storage full, ignore */ }

        return parsed;
      }

      if (response.status === 429) {
        console.warn(`Gemini rate limited (attempt ${attempt + 1}/${MAX_RETRIES})`);
        if (attempt === MAX_RETRIES - 1) {
          throw new Error('GEMINI_RATE_LIMITED');
        }
        continue; // retry
      }

      // Other HTTP errors — don't retry
      throw new Error(`GEMINI_API_ERROR: ${response.status}`);
    } catch (err) {
      if (err.message.startsWith('GEMINI_')) throw err;
      if (attempt === MAX_RETRIES - 1) throw err;
      console.warn('Gemini request error:', err.message);
    }
  }
}
