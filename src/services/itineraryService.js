/**
 * AI Itinerary Generation Service
 * Uses the @google/genai SDK with Gemma 4 26B model and High Thinking level.
 */
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { fetchPlacePhoto } from "./unsplashApi";

// Initialize the SDK with your API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// Model ID from user snippet
const MODEL_NAME = "gemma-4-26b-a4b-it";

/**
 * Robustly extract JSON from a string that might contain mixed content
 */
function extractJSON(text) {
  if (!text) return null;
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    try {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        const jsonStr = text.substring(start, end + 1);
        return JSON.parse(jsonStr);
      }
    } catch (innerErr) {
      console.error('Failed to extract JSON from segment:', text.substring(0, 100) + '...');
    }
    return null;
  }
}

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
  if (!apiKey) {
    console.error('Itinerary Service Error: Missing VITE_GEMINI_API_KEY');
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

    try {
      console.log(`Sending itinerary request to Gemini (${MODEL_NAME}, attempt ${attempt + 1})...`);

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          systemInstruction: "You are an expert AI itinerary planner. Always respond with raw JSON matching the requested structure.",
          temperature: 0.8,
        },
      });

      console.log('Gemini Itinerary Response received:', response);

      if (response && response.text) {
        const text = response.text;
        const parsed = extractJSON(text);

        if (parsed) {
          // Fetch photos for each activity in parallel
          const daysWithPhotos = await Promise.all(parsed.days.map(async (day) => {
            const morningPhoto = await fetchPlacePhoto(`${day.morning.location || day.morning.activity} ${parsed.destination_name || ''}`);
            const afternoonPhoto = await fetchPlacePhoto(`${day.afternoon.location || day.afternoon.activity} ${parsed.destination_name || ''}`);
            const eveningPhoto = await fetchPlacePhoto(`${day.evening.location || day.evening.activity} ${parsed.destination_name || ''}`);

            return {
              ...day,
              morning: { ...day.morning, photo: morningPhoto },
              afternoon: { ...day.afternoon, photo: afternoonPhoto },
              evening: { ...day.evening, photo: eveningPhoto },
            };
          }));

          return { ...parsed, days: daysWithPhotos, generatedAt: new Date().toISOString(), source: 'ai' };
        }
        
        throw new Error('GEMINI_JSON_EXTRACTION_FAILED');
      }

      throw new Error('GEMINI_INVALID_RESPONSE_FORMAT');
    } catch (err) {
      console.error('Gemini Itinerary API Error Detail:', {
        message: err.message,
        status: err.status,
        attempt: attempt + 1
      });
      
      if (err.message.includes('429') || err.message.toLowerCase().includes('rate limit')) {
        if (attempt === MAX_RETRIES - 1) throw new Error('GEMINI_RATE_LIMITED');
        continue;
      }
      
      if (err.message.includes('403')) throw new Error('GEMINI_API_FORBIDDEN');
      if (attempt === MAX_RETRIES - 1) throw err;
    }
  }
}
