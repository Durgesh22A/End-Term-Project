/**
 * Curated fallback destination data for when APIs are unavailable.
 * Also used as "Popular Destinations" suggestions before any search.
 */

export const popularDestinations = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    tagline: 'The City of Light and Love',
    emoji: '🇫🇷',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    overview: 'Paris captivates visitors with its iconic landmarks, world-class art museums, and romantic ambiance. From the Eiffel Tower to charming Montmartre streets, every corner tells a story.',
    top_attractions: [
      { name: 'Eiffel Tower', description: 'Iconic iron lattice tower offering panoramic city views from three observation levels.', visit_time: '2-3 hours', entry_fee: '€26', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&q=80' },
      { name: 'Louvre Museum', description: 'World\'s largest art museum home to the Mona Lisa and 380,000+ works spanning millennia.', visit_time: '3-4 hours', entry_fee: '€17', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80' },
      { name: 'Notre-Dame Cathedral', description: 'Medieval Gothic masterpiece on Île de la Cité, under restoration after 2019 fire.', visit_time: '1-2 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=600&q=80' },
      { name: 'Montmartre & Sacré-Cœur', description: 'Historic hilltop village with bohemian charm, street artists, and a stunning white basilica.', visit_time: '2-3 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600&q=80' },
      { name: 'Palace of Versailles', description: 'Opulent royal residence with Hall of Mirrors and vast manicured French gardens.', visit_time: '4-5 hours', entry_fee: '€21', image: 'https://images.unsplash.com/photo-1551410224-699683e15636?w=600&q=80' },
    ],
    local_cuisine: [
      { name: 'Croissants', description: 'Buttery, flaky pastries perfect for breakfast at a sidewalk café.', price_range: '€1-3', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&q=80' },
      { name: 'Coq au Vin', description: 'Classic French braised chicken in red wine with mushrooms and herbs.', price_range: '€15-25', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80' },
      { name: 'Crêpes', description: 'Thin French pancakes with sweet or savory fillings from street vendors.', price_range: '€4-8', image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80' },
      { name: 'French Onion Soup', description: 'Rich beef broth topped with melted Gruyère cheese and crusty bread.', price_range: '€8-14', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80' },
    ],
    budget_estimate: { budget: '$80-120/day', moderate: '$150-250/day', luxury: '$400+/day', currency: 'EUR' },
    best_time: 'April–June and September–October for mild weather and fewer crowds.',
    culture_tips: [
      'Learn basic French greetings — locals appreciate the effort.',
      'Tipping 5-10% is customary but not mandatory.',
      'Shops may close on Sundays; plan accordingly.',
      'Metro is the fastest way around — buy a carnet of 10 tickets.'
    ],
    safety_notes: 'Watch for pickpockets near tourist hotspots. Keep bags zipped and in front of you.'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    tagline: 'Where Ancient Temples Meet Neon Lights',
    emoji: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    overview: 'Tokyo is a vibrant metropolis blending ultra-modern technology with traditional temples. Experience the buzz of Shibuya Crossing, the serenity of Meiji Shrine, and the best food scene on Earth.',
    top_attractions: [
      { name: 'Senso-ji Temple', description: 'Tokyo\'s oldest and most significant Buddhist temple in the colorful Asakusa district.', visit_time: '1-2 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80' },
      { name: 'Shibuya Crossing', description: 'The world\'s busiest pedestrian intersection — an iconic Tokyo experience.', visit_time: '30 min', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80' },
      { name: 'Meiji Shrine', description: 'Peaceful Shinto shrine surrounded by a lush forest in the heart of the city.', visit_time: '1-2 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=600&q=80' },
      { name: 'Tsukiji Outer Market', description: 'Food lover\'s paradise with fresh sushi, street food, and Japanese delicacies.', visit_time: '2-3 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80' },
      { name: 'Tokyo Skytree', description: 'Tallest tower in Japan at 634m with observation decks offering city-wide panoramas.', visit_time: '1-2 hours', entry_fee: '¥2,100', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80' },
    ],
    local_cuisine: [
      { name: 'Sushi', description: 'Fresh nigiri and maki at everything from conveyor belt joints to Michelin stars.', price_range: '¥1,000-15,000', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80' },
      { name: 'Ramen', description: 'Rich noodle soup in many regional styles — try tonkotsu or miso.', price_range: '¥800-1,500', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80' },
      { name: 'Takoyaki', description: 'Crispy fried octopus balls topped with bonito flakes and tangy sauce.', price_range: '¥500-800', image: 'https://images.unsplash.com/photo-1578640735738-9e8c1c4ab1d3?w=400&q=80' },
      { name: 'Matcha Desserts', description: 'Green tea flavored ice cream, mochi, and cakes found everywhere.', price_range: '¥300-800', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=80' },
    ],
    budget_estimate: { budget: '$70-100/day', moderate: '$150-250/day', luxury: '$500+/day', currency: 'JPY' },
    best_time: 'March–May (cherry blossoms) and October–November (autumn foliage).',
    culture_tips: [
      'Bow when greeting — it shows respect.',
      'Remove shoes before entering homes and some restaurants.',
      'Tipping is NOT customary and can be considered rude.',
      'Trains are incredibly punctual — IC card (Suica/Pasmo) is essential.'
    ],
    safety_notes: 'One of the safest major cities in the world. Exercise normal caution with belongings.'
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    tagline: 'Island of Gods and Golden Sunsets',
    emoji: '🇮🇩',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    overview: 'Bali enchants with its terraced rice paddies, ancient Hindu temples, vibrant arts scene, and world-class surf breaks. A tropical paradise blending spirituality with adventure.',
    top_attractions: [
      { name: 'Ubud Rice Terraces', description: 'Stunning emerald-green terraced landscapes carved into hillsides over centuries.', visit_time: '2-3 hours', entry_fee: '$2', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80' },
      { name: 'Tanah Lot Temple', description: 'Dramatic sea temple perched on a rocky outcrop, spectacular at sunset.', visit_time: '1-2 hours', entry_fee: '$3', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80' },
      { name: 'Sacred Monkey Forest', description: 'Lush jungle sanctuary in Ubud home to 700+ long-tailed macaques.', visit_time: '1-2 hours', entry_fee: '$5', image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80' },
      { name: 'Mount Batur Sunrise Trek', description: 'Trek to the summit of this active volcano for a breathtaking sunrise panorama.', visit_time: '4-5 hours', entry_fee: '$30-50 guided', image: 'https://images.unsplash.com/photo-1604922824961-87cefb2e4b07?w=600&q=80' },
    ],
    local_cuisine: [
      { name: 'Nasi Goreng', description: 'Indonesia\'s signature fried rice with egg, vegetables, and sweet soy.', price_range: '$2-5', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80' },
      { name: 'Babi Guling', description: 'Balinese suckling pig roasted with turmeric and spices — a local feast.', price_range: '$5-10', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
      { name: 'Smoothie Bowls', description: 'Colorful acai and dragon fruit bowls — Bali\'s healthy food scene staple.', price_range: '$3-7', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80' },
    ],
    budget_estimate: { budget: '$30-50/day', moderate: '$80-150/day', luxury: '$300+/day', currency: 'IDR' },
    best_time: 'April–October (dry season) for best weather and outdoor activities.',
    culture_tips: [
      'Dress modestly when visiting temples — sarongs are often provided.',
      'Learn to say "Terima kasih" (thank you).',
      'Bargaining is expected at markets but be respectful.',
      'Rent a scooter for flexibility, but traffic is chaotic.'
    ],
    safety_notes: 'Be cautious with monkeys at temples — secure belongings. Drink bottled water only.'
  },
  {
    id: 'new-york',
    name: 'New York City',
    country: 'United States',
    tagline: 'The City That Never Sleeps',
    emoji: '🇺🇸',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    overview: 'New York City is a global powerhouse of culture, finance, and entertainment. From Broadway shows to Central Park strolls, the Big Apple offers limitless experiences across five boroughs.',
    top_attractions: [
      { name: 'Statue of Liberty', description: 'Iconic symbol of freedom on Liberty Island — book ferry + pedestal tickets early.', visit_time: '3-4 hours', entry_fee: '$24', image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=600&q=80' },
      { name: 'Central Park', description: '843-acre urban oasis with lakes, meadows, and the famous Bethesda Fountain.', visit_time: '2-4 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600&q=80' },
      { name: 'Times Square', description: 'Dazzling neon-lit intersection that epitomizes NYC energy — best at night.', visit_time: '1 hour', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80' },
      { name: 'Metropolitan Museum of Art', description: 'One of the world\'s greatest art museums with 2 million+ works across 5,000 years.', visit_time: '3-5 hours', entry_fee: '$30', image: 'https://images.unsplash.com/photo-1575503802870-45de6a6217c8?w=600&q=80' },
      { name: 'Brooklyn Bridge', description: 'Iconic suspension bridge with a pedestrian walkway offering stunning skyline views.', visit_time: '1-2 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=600&q=80' },
    ],
    local_cuisine: [
      { name: 'New York Pizza', description: 'Thin-crust, foldable slices from legendary pizzerias — a NYC rite of passage.', price_range: '$3-5/slice', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80' },
      { name: 'Bagels', description: 'Chewy, hand-rolled bagels with cream cheese — best breakfast in the city.', price_range: '$2-6', image: 'https://images.unsplash.com/photo-1585535936845-3f1e0a555f47?w=400&q=80' },
      { name: 'Pastrami Sandwich', description: 'Piled-high smoked pastrami on rye from iconic delis like Katz\'s.', price_range: '$20-25', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&q=80' },
    ],
    budget_estimate: { budget: '$100-150/day', moderate: '$200-350/day', luxury: '$600+/day', currency: 'USD' },
    best_time: 'April–June and September–November for pleasant weather.',
    culture_tips: [
      'Walk fast and stay to the right on sidewalks.',
      'Tip 18-20% at restaurants — it\'s expected, not optional.',
      'The subway runs 24/7 — get a MetroCard or use OMNY.',
      'Broadway shows: book in advance or try TKTS booth for discounts.'
    ],
    safety_notes: 'Avoid flashing expensive items. Stay aware in subway stations late at night.'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    tagline: 'Futuristic Skyline Meets Desert Magic',
    emoji: '🇦🇪',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    overview: 'Dubai dazzles with its record-breaking architecture, luxury shopping, pristine beaches, and desert adventures. A city where the future feels like now.',
    top_attractions: [
      { name: 'Burj Khalifa', description: 'World\'s tallest building at 828m — visit the observation deck at sunset.', visit_time: '2 hours', entry_fee: '$40', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80' },
      { name: 'Dubai Mall', description: 'World\'s largest mall with 1,200+ stores, an aquarium, and an ice rink.', visit_time: '3-5 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80' },
      { name: 'Desert Safari', description: 'Dune bashing, camel rides, and a traditional Bedouin camp dinner under the stars.', visit_time: '5-6 hours', entry_fee: '$50-80', image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=600&q=80' },
      { name: 'Palm Jumeirah', description: 'Iconic man-made island shaped like a palm tree, home to luxury resorts.', visit_time: '2-3 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80' },
    ],
    local_cuisine: [
      { name: 'Shawarma', description: 'Juicy spiced meat wrapped in flatbread — Dubai\'s favorite street food.', price_range: '$2-5', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80' },
      { name: 'Al Machboos', description: 'Spiced rice with meat — the UAE\'s national dish with aromatic flavors.', price_range: '$10-20', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80' },
      { name: 'Kunafa', description: 'Crispy shredded pastry with sweet cheese filling — a heavenly dessert.', price_range: '$5-10', image: 'https://images.unsplash.com/photo-1579888944880-d98341245702?w=400&q=80' },
    ],
    budget_estimate: { budget: '$80-130/day', moderate: '$200-350/day', luxury: '$800+/day', currency: 'AED' },
    best_time: 'November–March for comfortable temperatures (20-30°C).',
    culture_tips: [
      'Dress modestly in public areas — cover shoulders and knees.',
      'Friday is the holy day; many places have adjusted hours.',
      'No public displays of affection.',
      'Metro is clean, efficient, and has women-only carriages.'
    ],
    safety_notes: 'Extremely safe city with very low crime rates. Stay hydrated in summer heat.'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    tagline: 'Royal Heritage and Modern Culture',
    emoji: '🇬🇧',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    overview: 'London seamlessly blends centuries of royal history with cutting-edge art, theater, and dining. From Big Ben to Borough Market, every neighborhood has its own distinct personality.',
    top_attractions: [
      { name: 'Tower of London', description: 'Historic castle housing the Crown Jewels and 900+ years of royal history.', visit_time: '3 hours', entry_fee: '£33', image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80' },
      { name: 'British Museum', description: 'Free world-class museum with the Rosetta Stone and Egyptian mummies.', visit_time: '3-4 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1590081543587-7708e4753388?w=600&q=80' },
      { name: 'Buckingham Palace', description: 'Official residence of the monarch — catch the Changing of the Guard.', visit_time: '1-2 hours', entry_fee: 'Free (exterior)', image: 'https://images.unsplash.com/photo-1530981062536-3b3e0e1a02ef?w=600&q=80' },
      { name: 'Borough Market', description: 'London\'s oldest food market with artisan vendors and global street food.', visit_time: '2 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80' },
    ],
    local_cuisine: [
      { name: 'Fish & Chips', description: 'Golden battered cod with chunky chips and mushy peas — a British classic.', price_range: '£8-15', image: 'https://images.unsplash.com/photo-1579208030886-b1f5b7b4a776?w=400&q=80' },
      { name: 'Full English Breakfast', description: 'Eggs, bacon, sausages, beans, toast, tomato — the ultimate hearty start.', price_range: '£8-14', image: 'https://images.unsplash.com/photo-1533920379810-6bed43289506?w=400&q=80' },
      { name: 'Afternoon Tea', description: 'Elegant tiered service with finger sandwiches, scones, and pastries.', price_range: '£30-60', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
    ],
    budget_estimate: { budget: '$90-130/day', moderate: '$180-300/day', luxury: '$500+/day', currency: 'GBP' },
    best_time: 'May–September for warmer weather and longer daylight hours.',
    culture_tips: [
      'Stand on the right side of escalators — seriously.',
      'Queuing is a sacred tradition. Never cut in line.',
      'Use an Oyster card or contactless for public transport.',
      'Pubs typically stop serving food by 9 PM.'
    ],
    safety_notes: 'Generally very safe. Be wary of pickpockets on the Tube and in crowded tourist areas.'
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    tagline: 'Eternal City of Art and Gelato',
    emoji: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    overview: 'Rome is an open-air museum where ancient ruins, Renaissance art, and vibrant Italian culture coexist. Every cobblestone street leads to a masterpiece.',
    top_attractions: [
      { name: 'Colosseum', description: 'Iconic ancient amphitheater that once hosted gladiatorial combat for 50,000 spectators.', visit_time: '2-3 hours', entry_fee: '€18', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80' },
      { name: 'Vatican Museums & Sistine Chapel', description: 'Michelangelo\'s breathtaking ceiling and one of the world\'s greatest art collections.', visit_time: '3-4 hours', entry_fee: '€17', image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80' },
      { name: 'Trevi Fountain', description: 'Baroque masterpiece — toss a coin over your shoulder to ensure your return to Rome.', visit_time: '30 min', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=600&q=80' },
      { name: 'Pantheon', description: 'Perfectly preserved 2,000-year-old temple with the world\'s largest unreinforced concrete dome.', visit_time: '1 hour', entry_fee: '€5', image: 'https://images.unsplash.com/photo-1583265266785-1ab25a37f03e?w=600&q=80' },
    ],
    local_cuisine: [
      { name: 'Carbonara', description: 'Pasta with egg, pecorino, guanciale, and black pepper — Rome\'s signature dish.', price_range: '€10-16', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80' },
      { name: 'Gelato', description: 'Artisanal Italian ice cream in countless flavors — look for "produzione propria".', price_range: '€3-5', image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&q=80' },
      { name: 'Supplì', description: 'Fried rice balls with gooey mozzarella center — Rome\'s favorite street snack.', price_range: '€2-4', image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&q=80' },
    ],
    budget_estimate: { budget: '$70-110/day', moderate: '$150-250/day', luxury: '$400+/day', currency: 'EUR' },
    best_time: 'April–June and September–October for warm weather without summer heat.',
    culture_tips: [
      'Cover shoulders and knees when visiting churches.',
      'Never order cappuccino after 11 AM — it\'s a cultural faux pas.',
      'Eat where locals eat — avoid restaurants with picture menus.',
      'Coperto (cover charge) of €2-3 per person is normal in restaurants.'
    ],
    safety_notes: 'Watch for pickpockets on buses and near major tourist sites. Use licensed white taxis only.'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    tagline: 'Bollywood Dreams and Street Food Heaven',
    emoji: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    overview: 'Mumbai is India\'s city of dreams — where the historic Gateway of India meets Bollywood glamour. Experience the energy of local trains, the serenity of Marine Drive, and street food that will blow your mind.',
    top_attractions: [
      { name: 'Gateway of India', description: 'Grand arch monument on the waterfront, built in 1924 to commemorate King George V\'s visit.', visit_time: '1 hour', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&q=80' },
      { name: 'Marine Drive', description: 'Iconic 3.6km curved promenade along the coast — stunning at sunset, nicknamed the Queen\'s Necklace.', visit_time: '1-2 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=600&q=80' },
      { name: 'Elephanta Caves', description: 'UNESCO World Heritage rock-cut temples on an island, featuring stunning Shiva sculptures.', visit_time: '3-4 hours', entry_fee: '₹40', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80' },
      { name: 'Chhatrapati Shivaji Terminus', description: 'UNESCO-listed Victorian Gothic railway station — a masterpiece of architecture still in active use.', visit_time: '30 min', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80' },
    ],
    local_cuisine: [
      { name: 'Vada Pav', description: 'Mumbai\'s iconic potato fritter in a bun — the original Indian burger.', price_range: '₹15-30', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&q=80' },
      { name: 'Pav Bhaji', description: 'Spicy mashed vegetable curry served with buttery bread rolls — pure comfort food.', price_range: '₹60-120', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&q=80' },
      { name: 'Bombay Sandwich', description: 'Layered cheese and vegetable grilled sandwich with green chutney.', price_range: '₹30-80', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80' },
    ],
    budget_estimate: { budget: '$20-40/day', moderate: '$60-120/day', luxury: '$200+/day', currency: 'INR' },
    best_time: 'October–February for cool, dry weather. Avoid June–September (monsoon).',
    culture_tips: [
      'Remove shoes before entering temples and homes.',
      'Use your right hand for eating and greetings.',
      'Local trains are packed during rush hours — avoid 8-10 AM and 6-8 PM.',
      'Haggle at street markets — start at 50% of the quoted price.'
    ],
    safety_notes: 'Keep valuables secure in crowded areas. Use Uber/Ola for safe, metered rides.'
  }
];

/**
 * Find a fallback destination by name (fuzzy match).
 * If not found, generates a generic template so ANY destination works.
 */
export function findFallbackDestination(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  
  const match = popularDestinations.find(d =>
    d.name.toLowerCase().includes(q) ||
    d.country.toLowerCase().includes(q) ||
    d.id.includes(q)
  );

  if (match) return match;

  // Capitalize query for display
  const displayName = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Return a generic template for ANY other part of the globe
  return {
    id: q.replace(/\s+/g, '-'),
    name: displayName,
    country: 'World',
    tagline: 'Discover the hidden beauty',
    emoji: '✈️',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', // generic landscape
    overview: `${displayName} is a fascinating destination waiting to be explored. With its unique local culture, beautiful scenery, and historic landmarks, it offers an unforgettable experience for every traveler.`,
    top_attractions: [
      { name: 'Historic City Center', description: 'Wander through the old town to admire local architecture and historic monuments.', visit_time: '2-3 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1516483638261-f40af5a5fac6?w=600&q=80' },
      { name: 'City Museum', description: 'Learn about the rich local history, arts, and culture of the region.', visit_time: '2 hours', entry_fee: '$10-15', image: 'https://images.unsplash.com/photo-1518998053401-b25431cb51bb?w=600&q=80' },
      { name: 'Main City Park & Gardens', description: 'A beautiful green space perfect for an afternoon stroll or a picnic.', visit_time: '1-2 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1521404176332-9df7b4cb7df5?w=600&q=80' },
      { name: 'Local Market', description: 'Experience the bustling local market, buy souvenirs, and taste street food.', visit_time: '1-2 hours', entry_fee: 'Free', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&q=80' },
    ],
    local_cuisine: [
      { name: 'Local Signature Dish', description: 'Traditional recipe passed down through generations, rich in local flavors.', price_range: '$10-20', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
      { name: 'Street Food Snacks', description: 'Quick and tasty bites available from vendors around the city squares.', price_range: '$2-5', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
      { name: 'Traditional Dessert', description: 'Sweet local delicacy perfectly paired with coffee or tea.', price_range: '$3-8', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
    ],
    budget_estimate: { budget: '$50-80/day', moderate: '$100-200/day', luxury: '$300+/day', currency: 'USD' },
    best_time: 'Varies by region — spring or autumn are usually best.',
    culture_tips: [
      'Learn a few basic phrases in the local language.',
      'Be respectful of local customs and dress codes.',
      'Always carry a little local cash for small purchases.',
      'Don’t be afraid to wander off the main tourist streets.'
    ],
    safety_notes: 'Exercise standard travel precautions and secure your valuables in crowded tourist areas.'
  };
}
