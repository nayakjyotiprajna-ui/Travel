import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  role: 'user' | 'admin';
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
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    travelPreferences: { type: [String], default: [] },
    accessibilityPreferences: {
      lowMotion: { type: Boolean, default: false },
      audioGuide: { type: Boolean, default: false },
      textGuide: { type: Boolean, default: true },
      seniorFriendly: { type: Boolean, default: false },
      mobilityFriendly: { type: Boolean, default: false },
      enhancedVisuals: { type: Boolean, default: true },
      highContrast: { type: Boolean, default: false },
      largeText: { type: Boolean, default: false },
    },
    travellerType: { type: String, default: 'Explorer' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
