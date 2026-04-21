/**
 * AI Itinerary Generation Service
 * Uses Google Gemini API exclusively to generate personalized travel itineraries.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Build the Gemini prompt for itinerary generation
 */
function buildPrompt(tripData) {
  const {
    destination,
    startDate,
    endDate,
    duration,
    budget,
    currency = 'INR',
    interests = [],
    pace = 'balanced',
    travelers = 1,
    notes = '',
  } = tripData;

  const start = new Date(startDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const end = new Date(endDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const paceMap = {
    fast: 'Fast-paced: 4-5 activities per day, minimal downtime',
    balanced: 'Balanced: 2-3 activities with some free time each day',
    relaxed: 'Relaxed: 1-2 key activities per day with plenty of rest',
  };

  const interestList = interests.length > 0
    ? interests.join(', ')
    : 'general sightseeing, culture, food';

  return `You are an expert AI travel planner. Create a detailed day-wise itinerary for this trip:

**Trip Details:**
- Destination: ${destination}
- Dates: ${start} to ${end}
- Duration: ${duration || 'auto-calculate'} days
- Budget: ${budget} ${currency} total for ${travelers} traveler(s)
- Interests: ${interestList}
- Pace: ${paceMap[pace] || paceMap.balanced}
- Travelers: ${travelers}
${notes ? `- Notes: ${notes}` : ''}

**Rules:**
1. Create a plan for EACH day between start and end date
2. Each day has MORNING, AFTERNOON, and EVENING activities
3. Group geographically close locations on the same day
4. First day = arrival, last day = departure
5. Include specific restaurant recommendations
6. Be factually accurate with real places and real prices

Return ONLY valid JSON:
{
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Catchy 3-5 word day theme",
      "morning": { "activity": "...", "location": "...", "duration": "...", "tip": "...", "estimated_cost": "..." },
      "afternoon": { "activity": "...", "location": "...", "duration": "...", "tip": "...", "estimated_cost": "..." },
      "evening": { "activity": "...", "location": "...", "duration": "...", "tip": "...", "estimated_cost": "..." }
    }
  ],
  "budget_summary": { "estimated_daily_spend": "...", "total_estimated": "...", "saving_tips": ["..."] },
  "packing_tips": ["..."],
  "local_transport": "..."
}`;
}

/**
 * Generate a personalized day-wise itinerary via Gemini AI.
 * Retries up to 3 times on rate limits with exponential backoff.
 *
 * @param {object} tripData - Trip object from Firestore
 * @returns {object} Structured itinerary
 * @throws {Error} On API failure
 */
export async function generateItinerary(tripData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const prompt = buildPrompt(tripData);

  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [3000, 10000, 25000];

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_DELAYS[attempt - 1];
      console.log(`Retrying Gemini (${attempt + 1}/${MAX_RETRIES}) after ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error('GEMINI_EMPTY_RESPONSE');

      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return { ...parsed, generatedAt: new Date().toISOString(), source: 'ai' };
    }

    if (response.status === 429) {
      console.warn(`Gemini rate limited (attempt ${attempt + 1}/${MAX_RETRIES})`);
      if (attempt === MAX_RETRIES - 1) throw new Error('GEMINI_RATE_LIMITED');
      continue;
    }

    if (response.status === 403) throw new Error('GEMINI_API_FORBIDDEN');
    throw new Error(`GEMINI_API_ERROR_${response.status}`);
  }
}
