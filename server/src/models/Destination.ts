import mongoose, { Document, Schema } from 'mongoose';

export interface IAttraction {
  name: string;
  description: string;
  image?: string;
  hotspotPosition?: [number, number, number];
  tags?: string[];
}

export interface IActivityEmbedded {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'exploration' | 'photo' | 'cultural' | 'mini-game';
  xpReward: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
}

export interface IDestination extends Document {
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
  attractions: IAttraction[];
  activities: IActivityEmbedded[];
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
    mobilityRating: number; // 1 to 5
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
    avgHotelPrice: number; // in USD or INR
    avgDailyBudget: number;
    bestSeason: string;
    peakCrowdMonths: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: 'India' },
    state: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Mountains', 'Beaches', 'Heritage', 'Culture', 'Nature', 'Adventure', 'Family'],
    },
    images: { type: [String], default: [] },
    bannerImage: { type: String, required: true },
    modelUrl: { type: String },
    panoramaUrl: { type: String },
    attractions: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String },
        hotspotPosition: { type: [Number], default: [0, 0, 0] },
        tags: { type: [String], default: [] },
      },
    ],
    activities: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: {
          type: String,
          enum: ['quiz', 'exploration', 'photo', 'cultural', 'mini-game'],
          default: 'exploration',
        },
        xpReward: { type: Number, default: 50 },
        duration: { type: String, default: '10 mins' },
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Challenging'], default: 'Easy' },
      },
    ],
    culture: {
      traditions: { type: String, default: '' },
      etiquette: { type: String, default: '' },
      language: { type: String, default: '' },
      festivals: { type: [String], default: [] },
    },
    food: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        veg: { type: Boolean, default: true },
        iconic: { type: Boolean, default: false },
      },
    ],
    accessibility: {
      wheelchairAccessible: { type: Boolean, default: false },
      mobilityRating: { type: Number, min: 1, max: 5, default: 3 },
      audioSupportAvailable: { type: Boolean, default: true },
      terrainDifficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Challenging'],
        default: 'Moderate',
      },
      notes: { type: [String], default: [] },
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    featured: { type: Boolean, default: false },
    simulationDefaults: {
      avgHotelPrice: { type: Number, default: 80 },
      avgDailyBudget: { type: Number, default: 50 },
      bestSeason: { type: String, default: 'October - March' },
      peakCrowdMonths: { type: [String], default: ['December', 'January', 'May', 'June'] },
    },
  },
  { timestamps: true }
);

export const Destination = mongoose.model<IDestination>('Destination', DestinationSchema);
