import { GoogleGenAI } from "@google/genai";
import { fetchPlacePhoto } from "./unsplashApi";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL_NAME = "gemini-2.0-flash-lite";

function extractJSON(text) {
  if (!text) return null;
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    try {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        return JSON.parse(text.substring(start, end + 1));
      }
    } catch {
      console.error('Failed to extract JSON from response');
    }
    return null;
  }
}

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

export async function generateItinerary(tripData) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const prompt = buildPrompt(tripData);
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [3000, 10000, 25000];

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt - 1]));
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          temperature: 0.4,
          maxOutputTokens: 4000,
        },
      });

      if (response && response.text) {
        const parsed = extractJSON(response.text);
        if (parsed) {
          const daysWithPhotos = await Promise.all(parsed.days.map(async (day) => {
            const morningPhoto = await fetchPlacePhoto(`${day.morning.location || day.morning.activity}`);
            const afternoonPhoto = await fetchPlacePhoto(`${day.afternoon.location || day.afternoon.activity}`);
            const eveningPhoto = await fetchPlacePhoto(`${day.evening.location || day.evening.activity}`);
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
      if (err.message.includes('429') || err.message.toLowerCase().includes('rate limit')) {
        if (attempt === MAX_RETRIES - 1) throw new Error('GEMINI_RATE_LIMITED');
        continue;
      }
      if (err.message.includes('403')) throw new Error('GEMINI_API_FORBIDDEN');
      if (attempt === MAX_RETRIES - 1) throw err;
    }
  }
}
