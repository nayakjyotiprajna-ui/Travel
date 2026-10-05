import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TravelRoom } from '../models/TravelRoom';
import { Destination } from '../models/Destination';
import { User } from '../models/User';

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { destinationId } = req.body;
    const userId = req.user?.id;

    if (!destinationId) {
      return res.status(400).json({ success: false, message: 'destinationId is required.' });
    }

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    const host = await User.findById(userId);

    // Generate unique TRAVEL-XXXX code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const roomCode = `TRAVEL-${randomSuffix}`;

    const room = await TravelRoom.create({
      roomCode,
      hostId: userId,
      destinationId: destination._id,
      destinationName: destination.name,
      participants: [
        {
          userId: userId?.toString() || '',
          name: host?.name || 'Explorer',
          avatar: host?.avatar || '',
          isHost: true,
          joinedAt: new Date(),
        },
      ],
      currentLocation: `${destination.name} Scenic Point`,
      currentActivity: 'Group Exploration',
      chatMessages: [
        {
          senderId: 'system',
          senderName: 'TravelTwin AI',
          text: `Welcome to the shared travel room for ${destination.name}! Explore together and capture memories in real-time.`,
          timestamp: new Date(),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: `Travel room ${roomCode} created! Share this code with friends to travel together.`,
      room,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create travel room.' });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomCode } = req.body;
    const userId = req.user?.id;

    if (!roomCode) {
      return res.status(400).json({ success: false, message: 'Room code is required.' });
    }

    const cleanCode = roomCode.trim().toUpperCase();
    const room = await TravelRoom.findOne({ roomCode: cleanCode }).populate('destinationId');

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found with code: ' + cleanCode });
    }

    const user = await User.findById(userId);
    const alreadyJoined = room.participants.some((p) => p.userId === userId?.toString());

    if (!alreadyJoined) {
      room.participants.push({
        userId: userId?.toString() || '',
        name: user?.name || 'Explorer',
        avatar: user?.avatar || '',
        isHost: room.hostId.toString() === userId?.toString(),
        joinedAt: new Date(),
      });
      await room.save();
    }

    return res.json({
      success: true,
      message: `Successfully joined room ${cleanCode}!`,
      room,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to join room.' });
  }
};

export const getRoomByCode = async (req: AuthRequest, res: Response) => {
  try {
    const roomCode = req.params.code.trim().toUpperCase();
    const room = await TravelRoom.findOne({ roomCode }).populate('destinationId');

    if (!room) {
      return res.status(404).json({ success: false, message: 'Travel room not found.' });
    }

    return res.json({ success: true, room });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch room.' });
  }
};
