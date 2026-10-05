export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  travelPreferences: string[];
  accessibilityPreferences: {
    lowMotion: boolean;
    audioGuide: boolean;
    textGuide: boolean;
    seniorFriendly: boolean;
    mobilityFriendly: boolean;
    enhancedVisuals: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
  travellerType: string;
  xp: number;
  level: number;
}

export interface Attraction {
  name: string;
  description: string;
  image?: string;
  hotspotPosition?: [number, number, number];
  tags?: string[];
}

export interface ActivityEmbedded {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'exploration' | 'photo' | 'cultural' | 'mini-game';
  xpReward: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export interface Destination {
  _id: string;
  name: string;
  country: string;
  state: string;
  description: string;
  shortDescription: string;
  category: 'Mountains' | 'Beaches' | 'Heritage' | 'Culture' | 'Nature' | 'Adventure' | 'Family';
  images: string[];
  bannerImage: string;
  modelUrl?: string;
  panoramaUrl?: string;
  attractions: Attraction[];
  activities: ActivityEmbedded[];
  culture: {
    traditions: string;
    etiquette: string;
    language: string;
    festivals: string[];
  };
  food: Array<{
    name: string;
    description: string;
    veg: boolean;
    iconic: boolean;
  }>;
  accessibility: {
    wheelchairAccessible: boolean;
    mobilityRating: number;
    audioSupportAvailable: boolean;
    terrainDifficulty: 'Easy' | 'Moderate' | 'Challenging';
    notes: string[];
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  featured: boolean;
  simulationDefaults: {
    avgHotelPrice: number;
    avgDailyBudget: number;
    bestSeason: string;
    peakCrowdMonths: string[];
  };
}

export interface Journey {
  _id: string;
  userId: string;
  destinationId: Destination | string;
  mode: 'virtual' | 'simulation';
  preferences: string[];
  comfortMode: string;
  stops: Array<{
    name: string;
    description: string;
    completed: boolean;
  }>;
  activities: Array<{
    activityId: string;
    title: string;
    completed: boolean;
  }>;
  status: 'in-progress' | 'completed' | 'abandoned';
  xpAwarded: number;
  startedAt: string;
  completedAt?: string;
}

export interface Simulation {
  _id: string;
  userId: string;
  destinationId: Destination;
  travelDates: {
    start: string;
    end: string;
    durationDays: number;
  };
  travellers: number;
  budget: {
    range: string;
    amount: number;
    currency: string;
  };
  transport: string;
  accommodation: string;
  preferences: string[];
  accessibilityRequirements: string[];
  simulationResults: {
    hotelScenario: {
      name: string;
      type: string;
      costEstimate: number;
      rating: number;
      accessibilityScore: number;
      previewDescription: string;
    };
    transportScenario: {
      mode: string;
      travelTimeHours: number;
      scenicRating: number;
      accessibilityNotes: string;
    };
    touristPlaceScenario: {
      highlights: string[];
      crowdLevel: string;
      bestTimeOfDay: string;
    };
    crowdScenario: {
      level: 'Low' | 'Moderate' | 'High' | 'Peak';
      percentage: number;
      recommendation: string;
    };
    weatherScenario: {
      forecast: string;
      tempCelsius: number;
      condition: string;
      packingTips: string[];
    };
    activitiesScenario: Array<{
      title: string;
      estimatedTime: string;
      budgetImpact: string;
    }>;
  };
  aiPlan: {
    title: string;
    summary: string;
    estimatedTotalCost: number;
    days: Array<{
      dayNumber: number;
      theme: string;
      morning: { activity: string; place: string; duration: string; accessibility: string; notes: string };
      afternoon: { activity: string; place: string; duration: string; accessibility: string; notes: string };
      evening: { activity: string; place: string; duration: string; accessibility: string; notes: string };
    }>;
    potentialChallenges: string[];
    personalizedRecommendations: string[];
  };
  createdAt: string;
}

export interface PassportEntry {
  _id: string;
  destinationId: Destination;
  destinationName: string;
  category: string;
  stamp: {
    code: string;
    title: string;
    icon: string;
    color: string;
    issuedAt: string;
  };
  badge: {
    name: string;
    icon: string;
    description: string;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  };
  xpEarned: number;
  completedAt: string;
}

export interface Memory {
  _id: string;
  destinationId: Destination | string;
  destinationName: string;
  imageUrl: string;
  caption: string;
  sceneName: string;
  tags: string[];
  createdAt: string;
}

export interface TravelRoom {
  _id: string;
  roomCode: string;
  hostId: string;
  destinationId: Destination;
  destinationName: string;
  participants: Array<{
    userId: string;
    name: string;
    avatar: string;
    isHost: boolean;
    joinedAt: string;
  }>;
  currentLocation: string;
  currentActivity: string;
  chatMessages: Array<{
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export const TRAVELTWIN_TYPES = true;

