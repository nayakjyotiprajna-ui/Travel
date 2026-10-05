import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  destinationId: mongoose.Types.ObjectId;
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
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['quiz', 'exploration', 'photo', 'cultural', 'mini-game'],
      default: 'exploration',
    },
    xpReward: { type: Number, default: 50 },
    duration: { type: String, default: '5 mins' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Challenging'], default: 'Easy' },
    questions: [
      {
        question: { type: String },
        options: { type: [String] },
        correctAnswer: { type: Number },
        explanation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
