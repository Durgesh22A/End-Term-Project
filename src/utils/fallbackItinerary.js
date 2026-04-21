/**
 * Fallback Itinerary Generator
 * Generates realistic itineraries from curated data when the Gemini API is unavailable.
 * Covers popular destinations with hand-crafted day-wise plans.
 */

// ─── Destination Templates ───
const DESTINATION_DATA = {
  'las vegas': {
    activities: {
      morning: [
        { activity: 'Visit the Bellagio Conservatory & Botanical Gardens', location: 'Bellagio Hotel', duration: '1.5 hours', tip: 'Free entry — arrive early for fewer crowds', estimated_cost: 'Free' },
        { activity: 'Explore the High Roller Observation Wheel', location: 'The LINQ Promenade', duration: '1.5 hours', tip: 'Book the Happy Half Hour cabin for drinks included', estimated_cost: '$35' },
        { activity: 'Visit the Mob Museum', location: 'Downtown Las Vegas', duration: '2 hours', tip: 'Get the all-access pass for the best experience', estimated_cost: '$30' },
        { activity: 'Hike at Red Rock Canyon', location: 'Red Rock Canyon National Conservation Area', duration: '3 hours', tip: 'Start early to beat the desert heat, bring plenty of water', estimated_cost: '$15' },
        { activity: 'Visit the Neon Museum', location: 'Downtown Las Vegas', duration: '1.5 hours', tip: 'Book a guided tour for the full history experience', estimated_cost: '$20' },
        { activity: 'Explore the Venetian Grand Canal Shoppes', location: 'The Venetian Resort', duration: '2 hours', tip: 'Don\'t miss the gondola ride through the indoor canals', estimated_cost: '$35' },
        { activity: 'Visit Shark Reef Aquarium', location: 'Mandalay Bay', duration: '1.5 hours', tip: 'A great escape from the heat — touch pools for kids', estimated_cost: '$25' },
        { activity: 'Morning pool party at a resort', location: 'MGM Grand or Encore Beach Club', duration: '3 hours', tip: 'Arrive early for free entry before 11 AM at some clubs', estimated_cost: '$50' },
      ],
      afternoon: [
        { activity: 'Walk the Las Vegas Strip & see iconic hotels', location: 'Las Vegas Boulevard', duration: '3 hours', tip: 'Visit Caesars Palace, Luxor, and MGM Grand — all free to explore inside', estimated_cost: 'Free' },
        { activity: 'Watch the Fountains of Bellagio show', location: 'Bellagio Hotel', duration: '30 min', tip: 'Shows run every 15-30 minutes after noon — best viewed from the bridge', estimated_cost: 'Free' },
        { activity: 'Visit the Fremont Street Experience', location: 'Downtown Las Vegas', duration: '2.5 hours', tip: 'The Viva Vision light show runs every hour after sunset', estimated_cost: 'Free' },
        { activity: 'Shop at the Forum Shops at Caesars Palace', location: 'Caesars Palace', duration: '2 hours', tip: 'Watch the Atlantis animatronic show inside (free)', estimated_cost: 'Free-$$' },
        { activity: 'Visit the Valley of Fire State Park', location: 'Valley of Fire (1hr from Strip)', duration: '4 hours', tip: 'Rent a car — totally worth the drive for Fire Wave and Elephant Rock', estimated_cost: '$15 entry' },
        { activity: 'Explore the AREA15 immersive entertainment center', location: 'AREA15', duration: '3 hours', tip: 'Book Meow Wolf\'s Omega Mart for a mind-bending experience', estimated_cost: '$45' },
        { activity: 'Lunch and arcade at Bally\'s or Circus Circus', location: 'Las Vegas Strip', duration: '2 hours', tip: 'Circus Circus has free circus acts throughout the day', estimated_cost: '$30' },
        { activity: 'Visit the Welcome to Las Vegas sign for photos', location: 'South Las Vegas Blvd', duration: '45 min', tip: 'Go in the afternoon for the best lighting — small parking lot fills up fast', estimated_cost: 'Free' },
      ],
      evening: [
        { activity: 'Watch a Cirque du Soleil show', location: 'Various Strip hotels', duration: '2 hours', tip: 'Book "O" at Bellagio or "Mystère" at TI for the best value', estimated_cost: '$85-175' },
        { activity: 'Dinner at a celebrity chef restaurant', location: 'The Strip', duration: '2 hours', tip: 'Try Gordon Ramsay Hell\'s Kitchen or Guy Fieri\'s Vegas Kitchen', estimated_cost: '$60-100' },
        { activity: 'Nightlife on Fremont Street', location: 'Fremont East Entertainment District', duration: '3 hours', tip: 'More affordable bars and local vibes compared to the Strip', estimated_cost: '$40-80' },
        { activity: 'Try your luck at table games or slots', location: 'MGM Grand Casino', duration: '2 hours', tip: 'Set a strict budget before entering — start with penny slots', estimated_cost: '$50-200 (set limit)' },
        { activity: 'Watch the Bellagio Fountains by night + dinner', location: 'Bellagio / Eiffel Tower Restaurant', duration: '2.5 hours', tip: 'The fountains are magical at night — pair with dinner at Mon Ami Gabi for a view', estimated_cost: '$60-90' },
        { activity: 'Stroll the illuminated Strip at night', location: 'Las Vegas Boulevard', duration: '2 hours', tip: 'Walk from Luxor to Wynn for the best light show — take the pedestrian bridges', estimated_cost: 'Free' },
        { activity: 'Comedy show at a Strip hotel', location: 'The Mirage or Harrah\'s', duration: '1.5 hours', tip: 'Check Tix4Tonight for half-price same-day show tickets', estimated_cost: '$40-80' },
        { activity: 'Helicopter night tour over the Strip', location: 'Maverick Helicopters', duration: '15 min flight', tip: 'Best at sunset — book in advance for the best prices', estimated_cost: '$100-200' },
      ],
    },
    budget_summary: {
      estimated_daily_spend: '$100-250 per person per day',
      total_estimated: 'Depends on days and casino spending',
      saving_tips: [
        'Use the Las Vegas monorail ($13 day pass) instead of taxis on the Strip',
        'Many hotel buffets offer discounts with player cards — sign up for free',
        'Check Tix4Tonight booths on the Strip for half-price show tickets',
      ],
    },
    packing_tips: ['Comfortable walking shoes', 'Sunscreen and sunglasses', 'Light layers (AC inside is cold)', 'Refillable water bottle', 'Dressy outfit for evening shows/restaurants'],
    local_transport: 'The Las Vegas Monorail runs along the east side of the Strip ($5 single, $13 day pass). Use the Deuce bus ($8 day pass) for full Strip + Downtown coverage. Rideshare (Uber/Lyft) is easy — use designated pickup zones at each hotel.',
  },
};

// ─── Generic Activity Templates (for unknown destinations) ───
const GENERIC_ACTIVITIES = {
  morning: [
    { activity: 'Explore the main historic district and local architecture', location: 'City Center / Old Town', duration: '2 hours', tip: 'Start early to avoid tourist crowds and get the best photos', estimated_cost: 'Free' },
    { activity: 'Visit the most popular museum or cultural attraction', location: 'City\'s top-rated museum', duration: '2 hours', tip: 'Many museums offer free or discounted morning entry', estimated_cost: '$10-20' },
    { activity: 'Morning walk through the main park or garden', location: 'Central Park / Main Garden', duration: '1.5 hours', tip: 'Perfect for photography — bring a camera', estimated_cost: 'Free' },
    { activity: 'Visit a local food market for breakfast', location: 'Main Market / Food Hall', duration: '1.5 hours', tip: 'Try the local specialties — ask vendors for recommendations', estimated_cost: '$5-15' },
    { activity: 'Take a guided walking tour of the city', location: 'City Center (meeting point)', duration: '2.5 hours', tip: 'Free walking tours operate on tips — give what you feel it\'s worth', estimated_cost: '$5-15 (tip)' },
    { activity: 'Visit a famous temple, church, or religious site', location: 'Main religious landmark', duration: '1.5 hours', tip: 'Dress modestly and respect local customs', estimated_cost: 'Free-$10' },
    { activity: 'Morning yoga or outdoor exercise session', location: 'Waterfront / Main Park', duration: '1 hour', tip: 'Many cities have free outdoor fitness groups — check local social media', estimated_cost: 'Free' },
    { activity: 'Early morning scenic viewpoint visit', location: 'City\'s best viewpoint or hilltop', duration: '1.5 hours', tip: 'Sunrise is the most magical time — bring layers for the cold', estimated_cost: 'Free' },
    { activity: 'Shopping at a famous local street or bazaar', location: 'Main Shopping Street / Bazaar', duration: '2 hours', tip: 'Bargaining is expected in many places — start at 50% of the asking price', estimated_cost: 'Varies' },
    { activity: 'Visit a local art gallery or street art neighborhood', location: 'Arts District', duration: '1.5 hours', tip: 'Many galleries are free — check for current exhibitions', estimated_cost: 'Free-$15' },
  ],
  afternoon: [
    { activity: 'Have lunch at a top-rated local restaurant', location: 'Recommended local restaurant', duration: '1.5 hours', tip: 'Ask your hotel for recommendations — locals know the best hidden gems', estimated_cost: '$10-30' },
    { activity: 'Visit a landmark attraction or monument', location: 'City\'s iconic landmark', duration: '2 hours', tip: 'Book tickets online in advance to skip the line', estimated_cost: '$15-30' },
    { activity: 'Take a cooking or craft workshop', location: 'Local cooking school / workshop', duration: '2.5 hours', tip: 'Great way to learn about local culture — plus you eat what you cook!', estimated_cost: '$25-50' },
    { activity: 'Explore a vibrant local neighborhood on foot', location: 'Trendy / Historic Neighborhood', duration: '2 hours', tip: 'Get lost in side streets — that\'s where the real gems are', estimated_cost: 'Free' },
    { activity: 'Visit a nature spot, beach, or waterfront area', location: 'Nearest natural attraction', duration: '3 hours', tip: 'Pack a small snack and water — enjoy the natural surroundings', estimated_cost: 'Free-$10' },
    { activity: 'Take a boat tour or river cruise', location: 'Main river or harbor', duration: '1.5 hours', tip: 'Afternoon cruises often have the best light for photos', estimated_cost: '$15-40' },
    { activity: 'Visit a local theme park or adventure activity', location: 'Local adventure center', duration: '3 hours', tip: 'Book in advance for discounts and guaranteed entry', estimated_cost: '$20-50' },
    { activity: 'Relax at a local café and people-watch', location: 'City\'s most famous café area', duration: '1.5 hours', tip: 'Try the local coffee or tea specialty — every city has one', estimated_cost: '$5-10' },
    { activity: 'Day trip to a nearby attraction or town', location: 'Nearby town or attraction (1-2 hrs away)', duration: '4 hours', tip: 'Rent a car or take local transport — totally worth it', estimated_cost: '$20-50' },
    { activity: 'Explore a local historical fort or palace', location: 'Historical site / Fort / Palace', duration: '2 hours', tip: 'Hire a local guide for rich historical context', estimated_cost: '$10-25' },
  ],
  evening: [
    { activity: 'Dinner at a traditional restaurant', location: 'Celebrated local restaurant', duration: '2 hours', tip: 'Try the house speciality — it\'s usually the best dish on the menu', estimated_cost: '$15-40' },
    { activity: 'Night walk through illuminated landmarks', location: 'City\'s main illuminated area', duration: '1.5 hours', tip: 'Cities look completely different at night — bring your camera', estimated_cost: 'Free' },
    { activity: 'Catch a local performance, show, or concert', location: 'Local theater or performance venue', duration: '2 hours', tip: 'Check for free cultural events at city parks or public squares', estimated_cost: '$20-60' },
    { activity: 'Visit a rooftop bar or restaurant for sunset views', location: 'Best rooftop bar in the city', duration: '1.5 hours', tip: 'Go 30 minutes before sunset for golden hour photos and first drink', estimated_cost: '$15-30' },
    { activity: 'Night market or street food exploration', location: 'City\'s night market area', duration: '2 hours', tip: 'Come hungry — try at least 3-4 different stalls', estimated_cost: '$10-25' },
    { activity: 'Relax at the hotel with room service or spa', location: 'Your hotel', duration: '2 hours', tip: 'After a full day, self-care is important — don\'t feel guilty resting!', estimated_cost: '$20-50' },
    { activity: 'Sunset at the city\'s best viewpoint', location: 'Main viewpoint / hilltop', duration: '1 hour', tip: 'Arrive 30 minutes early for the best spot — bring a light jacket', estimated_cost: 'Free' },
    { activity: 'Join a nightlife experience or pub crawl', location: 'City\'s nightlife district', duration: '3 hours', tip: 'Look for organized pub crawls on Airbnb Experiences or GetYourGuide', estimated_cost: '$30-60' },
    { activity: 'Evening boat ride or river cruise with dinner', location: 'Main river or waterfront', duration: '2 hours', tip: 'Dinner cruises offer stunning night views — book in advance', estimated_cost: '$40-80' },
    { activity: 'Try a local dessert or sweet shop', location: 'Famous dessert spot or ice cream shop', duration: '45 min', tip: 'Ask locals what their childhood favorite dessert is', estimated_cost: '$5-15' },
  ],
};

const DAY_TITLES = [
  'Arrival & First Impressions',
  'Deep Dive into Culture',
  'Adventure & Exploration',
  'Hidden Gems & Local Life',
  'Scenic Views & Relaxation',
  'Food & Market Discovery',
  'History & Heritage Trail',
  'Art & Architecture Walk',
  'Nature & Outdoor Fun',
  'Shopping & Souvenirs',
  'Off-the-Beaten-Path Day',
  'Final Day & Farewell',
];

/**
 * Generate a fallback itinerary when the API is unavailable.
 * Uses curated data for known destinations, or generic templates for others.
 */
export function generateFallbackItinerary(tripData) {
  const {
    destination,
    startDate,
    endDate,
    budget,
    currency = 'INR',
    travelers = 1,
  } = tripData;

  // Calculate duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const numDays = Math.min(Math.max(duration, 1), 12); // cap at 12 days

  // Check if we have curated data for this destination
  const destKey = destination.toLowerCase().trim();
  const knownDest = DESTINATION_DATA[destKey];

  const morningPool = knownDest?.activities?.morning || GENERIC_ACTIVITIES.morning;
  const afternoonPool = knownDest?.activities?.afternoon || GENERIC_ACTIVITIES.afternoon;
  const eveningPool = knownDest?.activities?.evening || GENERIC_ACTIVITIES.evening;

  // Build day-wise plan
  const days = [];
  for (let i = 0; i < numDays; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i);

    // Pick activities (cycle through pools)
    const morning = { ...morningPool[i % morningPool.length] };
    const afternoon = { ...afternoonPool[i % afternoonPool.length] };
    const evening = { ...eveningPool[i % eveningPool.length] };

    // Customize first and last day
    let title = DAY_TITLES[i % DAY_TITLES.length];
    if (i === 0) {
      title = 'Arrival & First Impressions';
      morning.activity = `Arrive at ${destination} and check into your hotel`;
      morning.location = 'Hotel / Airport';
      morning.tip = 'Request early check-in or store your luggage if you arrive early';
      morning.estimated_cost = 'Transport cost';
      morning.duration = '2-3 hours';
    }
    if (i === numDays - 1) {
      title = 'Final Day & Farewell';
      evening.activity = `Pack up and head to the airport/station — farewell ${destination}!`;
      evening.location = 'Hotel / Airport';
      evening.tip = 'Keep 2-3 hours buffer for check-out and travel to the airport';
      evening.estimated_cost = 'Transport cost';
      evening.duration = '2-3 hours';
    }

    days.push({
      day: i + 1,
      date: dayDate.toISOString().split('T')[0],
      title,
      morning,
      afternoon,
      evening,
    });
  }

  const budgetEstimate = Math.round(budget / travelers / numDays);

  return {
    days,
    budget_summary: knownDest?.budget_summary || {
      estimated_daily_spend: `${currency} ${budgetEstimate.toLocaleString('en-IN')} per person per day`,
      total_estimated: `${currency} ${budget.toLocaleString('en-IN')} for ${travelers} traveler(s)`,
      saving_tips: [
        'Use public transport or walking instead of taxis',
        'Eat at local restaurants rather than tourist spots for better prices',
        'Book attractions online in advance for early-bird discounts',
      ],
    },
    packing_tips: knownDest?.packing_tips || [
      'Comfortable walking shoes',
      'Weather-appropriate clothing (check forecast)',
      'Universal power adapter',
      'Reusable water bottle',
      'Copies of important documents',
    ],
    local_transport: knownDest?.local_transport || `Use a combination of local public transport, walking, and rideshare apps to get around ${destination}. Check Google Maps for real-time transit directions.`,
    generatedAt: new Date().toISOString(),
    isFallback: true,
  };
}
