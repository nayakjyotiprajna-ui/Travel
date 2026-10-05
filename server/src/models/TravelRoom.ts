import mongoose, { Document, Schema } from 'mongoose';

export interface IParticipant {
  userId: string;
  name: string;
  avatar: string;
  socketId?: string;
  isHost: boolean;
  joinedAt: Date;
}

export interface IChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

export interface ITravelRoom extends Document {
  roomCode: string;
  hostId: mongoose.Types.ObjectId;
  destinationId: mongoose.Types.ObjectId;
  destinationName: string;
  participants: IParticipant[];
  currentLocation: string;
  currentActivity: string;
  chatMessages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const TravelRoomSchema = new Schema<ITravelRoom>(
  {
    roomCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    destinationName: { type: String, required: true },
    participants: [
      {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        avatar: { type: String, default: '' },
        socketId: { type: String },
        isHost: { type: Boolean, default: false },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    currentLocation: { type: String, default: 'Entrance / Main Square' },
    currentActivity: { type: String, default: 'Scenic Panorama Exploration' },
    chatMessages: [
      {
        senderId: { type: String, required: true },
        senderName: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const TravelRoom = mongoose.model<ITravelRoom>('TravelRoom', TravelRoomSchema);
