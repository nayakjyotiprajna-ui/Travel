import mongoose, { Document, Schema } from 'mongoose';

export interface IMemory extends Document {
  userId: mongoose.Types.ObjectId;
  destinationId: mongoose.Types.ObjectId;
  destinationName: string;
  imageUrl: string;
  caption: string;
  sceneName: string;
  tags: string[];
  createdAt: Date;
}

const MemorySchema = new Schema<IMemory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    destinationName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    caption: { type: String, required: true, trim: true },
    sceneName: { type: String, default: 'Scenic Viewpoint' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Memory = mongoose.model<IMemory>('Memory', MemorySchema);
