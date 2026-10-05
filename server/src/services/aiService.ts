import axios from 'axios';

export interface TravelDirectorInput {
  destination: string;
  mood: string;
  preferences: string[];
  comfortMode?: string;
  duration?: string;
}

export interface TravelDirectorOutput {
  destination: string;
  experienceType: string;
  stops: Array<{
    name: string;
    description: string;
    scenicHighlight: string;
    accessibilityNotes: string;
  }>;
  activities: Array<{
    title: string;
    duration: string;
    xpReward: number;
    type: string;
  }>;
  recommendations: string[];
  accessibilityNotes: string[];
  musicAmbiance: string;
}

export interface DestinationQAInput {
  destination: string;
  currentAttraction?: string;
  question: string;
  userAccessibilityNeeds?: string[];
}

export interface TripPlanInput {
  destination: string;
  durationDays: number;
  travellers: number;
  budgetRange: string;
  preferences: string[];
  transportPreference: string;
  accommodationPreference: string;
  accessibilityRequirements: string[];
}

export interface TripPlanOutput {
  title: string;
  summary: string;
  estimatedTotalCost: number;
  currency: string;
  days: Array<{
    dayNumber: number;
    theme: string;
    morning: { activity: string; place: string; duration: string; accessibility: string; notes: string };
    afternoon: { activity: string; place: string; duration: string; accessibility: string; notes: string };
    evening: { activity: string; place: string; duration: string; accessibility: string; notes: string };
  }>;
  potentialChallenges: string[];
  personalizedRecommendations: string[];
  accessibilityScore: number;
}

export class AIService {
  private static apiKey = process.env.AI_API_KEY || '';
  private static model = process.env.AI_MODEL || 'gemini-1.5-flash';

  /**
   * AI Travel Director: Creates a tailored, structured journey
   */
  public static async generateTravelDirectorJourney(
    input: TravelDirectorInput
  ): Promise<TravelDirectorOutput> {
    const prompt = `You are TravelTwin's AI Travel Director. A user requests a personalized journey.
Destination: ${input.destination}
Mood/Experience: ${input.mood}
Preferences: ${input.preferences.join(', ')}
Comfort Mode: ${input.comfortMode || 'Standard'}

Return ONLY a valid JSON object with the following structure:
{
  "destination": "${input.destination}",
  "experienceType": "${input.mood}",
  "stops": [
    { "name": "Stop Name", "description": "Engaging description", "scenicHighlight": "Visual highlight", "accessibilityNotes": "Accessibility feature" }
  ],
  "activities": [
    { "title": "Activity Title", "duration": "15 mins", "xpReward": 50, "type": "exploration" }
  ],
  "recommendations": ["Tip 1", "Tip 2"],
  "accessibilityNotes": ["Note 1", "Note 2"],
  "musicAmbiance": "Suggested ambient sound vibe"
}`;

    if (this.apiKey) {
      try {
        const response = await this.callGeminiOrLLM(prompt);
        const parsed = this.cleanAndParseJSON(response);
        if (parsed && parsed.stops) return parsed;
      } catch (err: any) {
        console.warn('[AI Service] LLM call failed, employing fallback engine:', err.message);
      }
    }

    // Intelligent domain fallback
    return this.fallbackTravelDirector(input);
  }

  /**
   * Destination Guide Q&A
   */
  public static async answerGuideQuestion(input: DestinationQAInput): Promise<string> {
    const prompt = `You are TravelTwin's on-site AI Travel Guide for ${input.destination}.
Current location/attraction: ${input.currentAttraction || 'General'}
User Accessibility Context: ${input.userAccessibilityNeeds?.join(', ') || 'Standard'}
User Question: "${input.question}"

Provide a concise, culturally rich, authentic, and informative answer (under 120 words).`;

    if (this.apiKey) {
      try {
        const response = await this.callGeminiOrLLM(prompt);
        if (response && response.trim()) return response.trim();
      } catch (err: any) {
        console.warn('[AI Service] LLM call failed, employing fallback guide:', err.message);
      }
    }

    return this.fallbackGuideAnswer(input);
  }

  /**
   * AI Personalized Travel Plan & Simulation Analysis
   */
  public static async generatePersonalizedTravelPlan(input: TripPlanInput): Promise<TripPlanOutput> {
    const prompt = `You are TravelTwin's expert AI Trip Architect.
Destination: ${input.destination}
Duration: ${input.durationDays} days
Travellers: ${input.travellers}
Budget Category: ${input.budgetRange}
Preferences: ${input.preferences.join(', ')}
Transport: ${input.transportPreference}
Stay: ${input.accommodationPreference}
Accessibility: ${input.accessibilityRequirements.join(', ')}

Generate a day-by-day travel plan. Return ONLY JSON matching this structure:
{
  "title": "Crafted Itinerary Title",
  "summary": "2 sentence executive overview",
  "estimatedTotalCost": 1200,
  "currency": "USD",
  "days": [
    {
      "dayNumber": 1,
      "theme": "Arrival & Gentle Discovery",
      "morning": { "activity": "...", "place": "...", "duration": "3 hrs", "accessibility": "...", "notes": "..." },
      "afternoon": { "activity": "...", "place": "...", "duration": "3 hrs", "accessibility": "...", "notes": "..." },
      "evening": { "activity": "...", "place": "...", "duration": "2 hrs", "accessibility": "...", "notes": "..." }
    }
  ],
  "potentialChallenges": ["Challenge 1", "Challenge 2"],
  "personalizedRecommendations": ["Recommendation 1", "Recommendation 2"],
  "accessibilityScore": 92
}`;

    if (this.apiKey) {
      try {
        const response = await this.callGeminiOrLLM(prompt);
        const parsed = this.cleanAndParseJSON(response);
        if (parsed && parsed.days) return parsed;
      } catch (err: any) {
        console.warn('[AI Service] LLM call failed, employing fallback itinerary planner:', err.message);
      }
    }

    return this.fallbackItineraryPlan(input);
  }

  // --- LLM API Caller ---
  private static async callGeminiOrLLM(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    };

    const res = await axios.post(url, payload, { timeout: 12000 });
    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  private static cleanAndParseJSON(text: string): any {
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }

  // --- High-Fidelity Domain Fallback Engines ---

  private static fallbackTravelDirector(input: TravelDirectorInput): TravelDirectorOutput {
    const dest = input.destination || 'Kashmir';
    const isKashmir = dest.toLowerCase().includes('kashmir');
    const isGoa = dest.toLowerCase().includes('goa');
    const isKonark = dest.toLowerCase().includes('konark');
    const isRajasthan = dest.toLowerCase().includes('rajasthan');
    const isKerala = dest.toLowerCase().includes('kerala');
    const isLadakh = dest.toLowerCase().includes('ladakh');

    if (isKashmir) {
      return {
        destination: 'Kashmir',
        experienceType: input.mood || 'peaceful',
        stops: [
          {
            name: 'Dal Lake Golden Hour',
            description: 'Glide peacefully across calm waters in a hand-carved cedarwood Shikara with lotus blossoms in view.',
            scenicHighlight: 'Reflective Pir Panjal peaks glowing under the amber sunset.',
            accessibilityNotes: 'Low-motion cruise profile, stabilized camera viewpoint, captioned audio guidance.'
          },
          {
            name: 'Floating Vegetable Market',
            description: 'Century-old dawn trading traditions with fragrant saffron kahwa tea aroma in the air.',
            scenicHighlight: 'Vibrant local produce on wooden skiffs.',
            accessibilityNotes: 'Text narration available, gentle pacing.'
          },
          {
            name: 'Gulmarg Meadow of Flowers',
            description: 'Vast alpine meadows nestled beneath snowy crests and gentle pine-scented breezes.',
            scenicHighlight: 'Afar cable car ascent to Mount Apharwat.',
            accessibilityNotes: 'Stationary rest points simulated, step-free navigation.'
          },
          {
            name: 'Mughal Gardens of Shalimar Bagh',
            description: 'Cascading terraced water fountains built by Emperor Jahangir for Empress Nur Jahan.',
            scenicHighlight: 'Centuries-old Chinar trees with fiery autumn leaves.',
            accessibilityNotes: 'Ramp-compatible virtual paths, relaxed sensory mode.'
          }
        ],
        activities: [
          { title: 'Sip Kashmiri Kahwa', duration: '5 mins', xpReward: 50, type: 'cultural' },
          { title: 'Shikara Sunset Photo Capture', duration: '10 mins', xpReward: 75, type: 'photo' },
          { title: 'Chinar Tree Heritage Discovery', duration: '8 mins', xpReward: 60, type: 'exploration' }
        ],
        recommendations: [
          'Best experienced with sound enabled to hear the gentle ripple of Dal Lake water.',
          'Comfort Mode active: motion blur reduced for sensitive viewers.'
        ],
        accessibilityNotes: [
          'High visual clarity with zero abrupt rotational shifts.',
          'Full keyboard control & transcript subtitles enabled.'
        ],
        musicAmbiance: 'Traditional Kashmiri Santoor & gentle water ripples'
      };
    }

    if (isGoa) {
      return {
        destination: 'Goa',
        experienceType: input.mood || 'relaxed',
        stops: [
          {
            name: 'Palolem Crescent Beach',
            description: 'Gentle turquoise waves lapping against powdery white sand fringed with coconut palms.',
            scenicHighlight: 'Silhouetted fishing boats against a tangerine sunset horizon.',
            accessibilityNotes: 'Flat beach boardwalk navigation, ambient ocean wave sounds.'
          },
          {
            name: 'Fontainhas Latin Quarter',
            description: 'Cobblestone streets with pastel-hued Portuguese heritage villas and terracotta tiled roofs.',
            scenicHighlight: 'Ornate wrought iron balconies and bougainvillea blossoms.',
            accessibilityNotes: 'Step-free camera pan, audio architectural narration.'
          },
          {
            name: 'Dudhsagar Cascades Viewpoint',
            description: 'Tiered milky waterfalls gushing through lush Western Ghats tropical forest.',
            scenicHighlight: 'Railway viaduct arched dramatically across waterfall spray.',
            accessibilityNotes: 'Low vestibular motion, adjustable sound level.'
          }
        ],
        activities: [
          { title: 'Spot Atlantic Dolphins', duration: '5 mins', xpReward: 50, type: 'exploration' },
          { title: 'Heritage Villa Architecture Walk', duration: '10 mins', xpReward: 75, type: 'cultural' },
          { title: 'Golden Hour Beach Snapshot', duration: '5 mins', xpReward: 60, type: 'photo' }
        ],
        recommendations: [
          'Feel the tranquil rhythm of coastal susegad living.',
          'Optimized for relaxed browsing with zero sensory overload.'
        ],
        accessibilityNotes: ['Audio descriptions for architectural highlights included.'],
        musicAmbiance: 'Acoustic bossa nova guitar blended with soft ocean swell'
      };
    }

    // Generic fallback for any other destination (Konark, Rajasthan, Kerala, Ladakh, etc.)
    return {
      destination: dest,
      experienceType: input.mood || 'immersive discovery',
      stops: [
        {
          name: `${dest} Historic Center`,
          description: `Immerse yourself in the timeless architectural wonders and living heritage of ${dest}.`,
          scenicHighlight: 'Iconic panoramic viewpoint bathed in warm natural sunlight.',
          accessibilityNotes: 'Smooth camera interpolation, level walking trajectory.'
        },
        {
          name: `${dest} Cultural Heart`,
          description: `Encounter local artisans, traditional music, and centuries of preserved customs.`,
          scenicHighlight: 'Artistic craftsmanship and vibrant color palettes.',
          accessibilityNotes: 'Multilingual text annotations with high contrast support.'
        },
        {
          name: `${dest} Natural Sanctuaries`,
          description: `Breathtaking landscapes showcasing the untamed majesty of regional geography.`,
          scenicHighlight: 'Wide-angle landscape vista.',
          accessibilityNotes: 'Rest points positioned at regular intervals.'
        }
      ],
      activities: [
        { title: `Explore ${dest} Icons`, duration: '10 mins', xpReward: 70, type: 'exploration' },
        { title: 'Cultural Trivia Challenge', duration: '5 mins', xpReward: 50, type: 'quiz' },
        { title: 'Scenic Vista Memory Capture', duration: '5 mins', xpReward: 60, type: 'photo' }
      ],
      recommendations: [
        `Personalized based on your preference for ${input.preferences.join(', ') || 'discovery'}.`,
        'Comfort mode parameters configured for maximum visual comfort.'
      ],
      accessibilityNotes: [
        'Accessible color palette with WCAG AAA conformance.',
        'Audio guide narration ready.'
      ],
      musicAmbiance: 'Warm ambient acoustic instruments and atmospheric nature sounds'
    };
  }

  private static fallbackGuideAnswer(input: DestinationQAInput): string {
    const q = input.question.toLowerCase();
    const dest = input.destination.toLowerCase();

    if (q.includes('why') && q.includes('dal lake')) {
      return 'Dal Lake is renowned as the "Jewel in the crown of Kashmir". Spanning 18 sq km, it is celebrated for its iconic wooden houseboats, vibrant floating flower and vegetable markets, and traditional Shikara boats navigating tranquil mirrored waters framed by the snow-capped Pir Panjal mountains.';
    }

    if (q.includes('gulmarg') || q.includes('snow')) {
      return 'Gulmarg ("Meadow of Flowers") sits at 2,650 meters altitude. It is famous for hosting one of the world’s highest operational cable cars (Gulmarg Gondola reaching 3,980m on Apharwat Peak) and world-class powdery ski slopes in winter.';
    }

    if (dest.includes('konark') || q.includes('sun temple')) {
      return 'The Konark Sun Temple in Odisha is a 13th-century UNESCO World Heritage marvel engineered as a colossal chariot for the Sun God Surya, complete with 24 intricately carved stone wheels that function as precise astronomical sundials.';
    }

    if (dest.includes('goa') || q.includes('church') || q.includes('beach')) {
      return 'Goa combines Portuguese colonial heritage (notably the 16th-century Basilica of Bom Jesus containing St. Francis Xavier’s relics) with golden Arabian Sea coastlines and distinct Konkani-Portuguese fusion culinary traditions.';
    }

    if (dest.includes('rajasthan') || q.includes('palace') || q.includes('fort')) {
      return 'Rajasthan is India’s legendary desert realm of royalty, celebrated for impregnable hilltop fortresses like Amber and Mehrangarh, intricate havelis with mirrored mosaic courtyards, and vibrant folk music traditions.';
    }

    if (dest.includes('kerala') || q.includes('backwater')) {
      return 'Kerala, known as "God\'s Own Country", is acclaimed for its 900-kilometer labyrinth of tranquil backwaters, traditional kettuvallam houseboats, fragrant spice hills in Munnar, and ancient Ayurvedic healing sanctuaries.';
    }

    if (dest.includes('ladakh') || q.includes('monastery') || q.includes('pangong')) {
      return 'Ladakh is a high-altitude desert kingdom nestled at over 3,000 meters in the Himalayas, revered for turquoise lakes like Pangong Tso, dramatic Buddhist cliffside monasteries like Thiksey, and ancient Silk Route crossroads.';
    }

    return `At ${input.destination}, this location is renowned for its cultural depth, exceptional historical architecture, and scenic natural landscapes. You can experience this site safely and comfortably in TravelTwin's interactive virtual environment.`;
  }

  private static fallbackItineraryPlan(input: TripPlanInput): TripPlanOutput {
    const daysCount = Math.max(1, Math.min(input.durationDays || 3, 7));
    const isKashmir = input.destination.toLowerCase().includes('kashmir');
    const isGoa = input.destination.toLowerCase().includes('goa');

    const days: TripPlanOutput['days'] = [];

    for (let i = 1; i <= daysCount; i++) {
      if (i === 1) {
        days.push({
          dayNumber: 1,
          theme: isKashmir ? 'Arrival in Srinagar & Dal Lake Sunset' : 'Arrival & Scenic Neighborhood Orientation',
          morning: {
            activity: 'Scenic check-in and luggage settle',
            place: isKashmir ? 'Boulevard Road Boutique Heritage Stay' : 'Central Boutique Hotel',
            duration: '2.5 hrs',
            accessibility: 'Step-free elevator access, roll-in luggage ramps',
            notes: 'Rest after transit; hydrate well for acclimatization.'
          },
          afternoon: {
            activity: 'Traditional local luncheon and artisan walk',
            place: isKashmir ? 'Ahdoos Traditional Wazwan Bistro' : 'Heritage Quarter Bistro',
            duration: '2.5 hrs',
            accessibility: 'Paved level sidewalks, ground-floor dining',
            notes: 'Savor regional specialties tailored to dietary preferences.'
          },
          evening: {
            activity: 'Golden hour scenic cruise',
            place: isKashmir ? 'Dal Lake Sunset Shikara' : 'Harbor / Promenade Vista',
            duration: '2 hrs',
            accessibility: 'Staff-assisted gentle boarding, wide cushioned benches',
            notes: 'Prime photography lighting with gentle ambient breezes.'
          }
        });
      } else if (i === 2) {
        days.push({
          dayNumber: 2,
          theme: isKashmir ? 'Alpine Wonders & Meadow Exploration' : 'Historic Icons & Cultural Heritage',
          morning: {
            activity: 'Alpine excursion & cable car ascent',
            place: isKashmir ? 'Gulmarg Gondola Station' : 'Ancient Citadel & Heritage Monument',
            duration: '3.5 hrs',
            accessibility: 'Designated priority lanes, wheelchair-compatible gondola cabins',
            notes: 'Dress warmly in layered windbreakers.'
          },
          afternoon: {
            activity: 'Scenic meadow picnic and valley photography',
            place: isKashmir ? 'Kongdoori Plateau' : 'Botanical Terraces & Art Pavilion',
            duration: '2 hrs',
            accessibility: 'Paved viewing platform, tactile signage',
            notes: 'Clear mountain vista with panoramic 360-degree sightlines.'
          },
          evening: {
            activity: 'Artisan workshop and folk music session',
            place: isKashmir ? 'Pashmina & Walnut Wood Craft Emporium' : 'Regional Cultural Center',
            duration: '2 hrs',
            accessibility: 'Spacious ground floor layout, audio amplification available',
            notes: 'Interactive demonstration with master craftspeople.'
          }
        });
      } else {
        days.push({
          dayNumber: i,
          theme: `Day ${i}: Hidden Gems & Sensory Retrospective`,
          morning: {
            activity: 'Lakeside botanical garden discovery',
            place: isKashmir ? 'Pari Mahal & Chashme Shahi' : 'Coastal Sanctuary & Nature Reserve',
            duration: '3 hrs',
            accessibility: 'Ramp-assisted terraced access, shady resting gazebos',
            notes: 'Cool morning temperatures and chirping songbirds.'
          },
          afternoon: {
            activity: 'Culinary tasting session and local market trail',
            place: isKashmir ? 'Lal Chowk Historic Bazaar' : 'Artisanal Spice & Produce Market',
            duration: '2.5 hrs',
            accessibility: 'Wide pedestrianized streets, visual price menus',
            notes: 'Purchase authentic saffron, dried walnuts, and handcrafted souvenirs.'
          },
          evening: {
            activity: 'Farewell candlelight dinner overlooking panoramic vista',
            place: isKashmir ? 'High-Ridge Viewpoint Restaurant' : 'Cliffside Sunset Restaurant',
            duration: '2.5 hrs',
            accessibility: 'Step-free entry, accessible restroom facilities',
            notes: 'Reflect upon memorable moments and capture final trip photos.'
          }
        });
      }
    }

    const baseCostPerDay = input.budgetRange === 'Budget' ? 45 : input.budgetRange === 'Luxury' ? 240 : 110;
    const estimatedTotal = baseCostPerDay * daysCount * (input.travellers || 1);

    return {
      title: `Personalized ${daysCount}-Day ${input.destination} Journey`,
      summary: `Carefully optimized for ${input.travellers} traveller(s) seeking a ${input.preferences.join(' & ') || 'balanced'} experience with specialized accessibility considerations.`,
      estimatedTotalCost: estimatedTotal,
      currency: 'USD',
      days,
      potentialChallenges: [
        'Peak hours between 11:30 AM and 2:00 PM may have increased foot traffic at major heritage sites.',
        'High-altitude alpine zones may experience swift temperature fluctuations; thermal layering recommended.',
        'Advance reservations suggested for heritage boat excursions.'
      ],
      personalizedRecommendations: [
        `Tailored specifically for ${input.transportPreference || 'comfortable transit'} with gentle transit intervals.`,
        'All primary morning itineraries feature verified accessible routes and priority entry options.',
        'Keep hydration packets handy and use the TravelTwin mobile companion for real-time accessibility alerts.'
      ],
      accessibilityScore: 94
    };
  }
}
