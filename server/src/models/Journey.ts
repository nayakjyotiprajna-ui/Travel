import mongoose, { Document, Schema } from 'mongoose';

export interface IJourney extends Document {
  userId: mongoose.Types.ObjectId;
  destinationId: mongoose.Types.ObjectId;
  mode: 'virtual' | 'simulation';
  preferences: string[];
  comfortMode: string;
  stops: Array<{
    name: string;
    description: string;
    completed: boolean;
    timestamp?: Date;
  }>;
  activities: Array<{
    activityId: string;
    title: string;
    completed: boolean;
    score?: number;
  }>;
  status: 'in-progress' | 'completed' | 'abandoned';
  xpAwarded: number;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JourneySchema = new Schema<IJourney>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    mode: { type: String, enum: ['virtual', 'simulation'], default: 'virtual' },
    preferences: { type: [String], default: [] },
    comfortMode: { type: String, default: 'Standard' },
    stops: [
      {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        completed: { type: Boolean, default: false },
        timestamp: { type: Date },
      },
    ],
    activities: [
      {
        activityId: { type: String, required: true },
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        score: { type: Number, default: 0 },
      },
    ],
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    xpAwarded: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Journey = mongoose.model<IJourney>('Journey', JourneySchema);
