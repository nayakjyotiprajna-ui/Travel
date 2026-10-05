import mongoose, { Document, Schema } from 'mongoose';

export interface ISimulation extends Document {
  userId: mongoose.Types.ObjectId;
  destinationId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const SimulationSchema = new Schema<ISimulation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    travelDates: {
      start: { type: String, required: true },
      end: { type: String, required: true },
      durationDays: { type: Number, required: true, default: 3 },
    },
    travellers: { type: Number, required: true, default: 1 },
    budget: {
      range: { type: String, default: 'Moderate' },
      amount: { type: Number, default: 1200 },
      currency: { type: String, default: 'USD' },
    },
    transport: { type: String, default: 'Flight + Scenic Cab' },
    accommodation: { type: String, default: 'Boutique Heritage Resort' },
    preferences: { type: [String], default: [] },
    accessibilityRequirements: { type: [String], default: [] },
    simulationResults: { type: Schema.Types.Mixed, required: true },
    aiPlan: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Simulation = mongoose.model<ISimulation>('Simulation', SimulationSchema);
