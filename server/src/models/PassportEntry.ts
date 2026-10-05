import mongoose, { Document, Schema } from 'mongoose';

export interface IPassportEntry extends Document {
  userId: mongoose.Types.ObjectId;
  destinationId: mongoose.Types.ObjectId;
  destinationName: string;
  category: string;
  stamp: {
    code: string;
    title: string;
    icon: string;
    color: string;
    issuedAt: Date;
  };
  badge: {
    name: string;
    icon: string;
    description: string;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  };
  xpEarned: number;
  completedAt: Date;
}

const PassportEntrySchema = new Schema<IPassportEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    destinationName: { type: String, required: true },
    category: { type: String, default: 'Explorer' },
    stamp: {
      code: { type: String, required: true },
      title: { type: String, required: true },
      icon: { type: String, default: '✈️' },
      color: { type: String, default: '#06B6D4' },
      issuedAt: { type: Date, default: Date.now },
    },
    badge: {
      name: { type: String, required: true },
      icon: { type: String, default: '🏆' },
      description: { type: String, default: 'Completed virtual exploration' },
      tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Diamond'], default: 'Gold' },
    },
    xpEarned: { type: Number, default: 250 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One entry per user per destination
PassportEntrySchema.index({ userId: 1, destinationId: 1 }, { unique: true });

export const PassportEntry = mongoose.model<IPassportEntry>('PassportEntry', PassportEntrySchema);
