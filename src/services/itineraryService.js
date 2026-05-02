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
    console.warn('[Itinerary] Gemini API key missing, using fallback generator.');
    return generateFallbackItinerary(tripData);
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
        if (attempt === MAX_RETRIES - 1) {
          console.warn('[Itinerary] Rate limit reached, using fallback generator.');
          return generateFallbackItinerary(tripData);
        }
        continue;
      }
      if (err.message.includes('403')) {
        console.warn('[Itinerary] API Forbidden, using fallback generator.');
        return generateFallbackItinerary(tripData);
      }
      if (attempt === MAX_RETRIES - 1) {
        console.warn('[Itinerary] Unknown error, using fallback generator.');
        return generateFallbackItinerary(tripData);
      }
    }
  }
}

async function generateFallbackItinerary(tripData) {
  const { destination, duration = 3 } = tripData;
  const days = [];
  
  for (let i = 1; i <= duration; i++) {
    const d = new Date(tripData.startDate);
    d.setDate(d.getDate() + (i - 1));
    
    days.push({
      day: i,
      date: d.toISOString().split('T')[0],
      title: i === 1 ? "Arrival & Exploration" : i === duration ? "Departure & Souvenirs" : "Local Highlights",
      morning: { 
        activity: `Explore ${destination} City Center`, 
        location: `${destination} Main Square`, 
        duration: "3 hours", 
        tip: "Start early to avoid crowds.", 
        estimated_cost: "Free",
        photo: await fetchPlacePhoto(`${destination} City Center`)
      },
      afternoon: { 
        activity: `Visit popular museum or landmark`, 
        location: `${destination} Museum`, 
        duration: "2-3 hours", 
        tip: "Check entry times online.", 
        estimated_cost: "Standard entry",
        photo: await fetchPlacePhoto(`${destination} Museum`)
      },
      evening: { 
        activity: `Dinner at local traditional restaurant`, 
        location: `${destination} Old Town`, 
        duration: "2 hours", 
        tip: "Try the signature local dish.", 
        estimated_cost: "Moderate",
        photo: await fetchPlacePhoto(`${destination} Traditional Food`)
      }
    });
  }

  return {
    days,
    budget_summary: { estimated_daily_spend: "Moderate", total_estimated: "Varies", saving_tips: ["Use public transport", "Eat at local markets"] },
    packing_tips: ["Comfortable walking shoes", "Weather-appropriate clothing", "Camera"],
    local_transport: "Public transit, walking, or local taxis.",
    generatedAt: new Date().toISOString(),
    source: 'fallback'
  };
}
