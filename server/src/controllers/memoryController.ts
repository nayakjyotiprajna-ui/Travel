import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Memory } from '../models/Memory';
import { Destination } from '../models/Destination';

export const getMemories = async (req: AuthRequest, res: Response) => {
  try {
    const memories = await Memory.find({ userId: req.user?.id })
      .populate('destinationId', 'name state country bannerImage')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: memories.length, memories });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch memories.' });
  }
};

export const createMemory = async (req: AuthRequest, res: Response) => {
  try {
    const { destinationId, imageUrl, caption, sceneName, tags } = req.body;

    if (!destinationId || !imageUrl || !caption) {
      return res.status(400).json({ success: false, message: 'destinationId, imageUrl, and caption are required.' });
    }

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    const memory = await Memory.create({
      userId: req.user?.id,
      destinationId,
      destinationName: destination.name,
      imageUrl,
      caption,
      sceneName: sceneName || 'Virtual Panorama Observation',
      tags: tags || [destination.category, 'Virtual Travel'],
    });

    return res.status(201).json({
      success: true,
      message: 'Memory captured and stored in your Travel Twin album!',
      memory,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create memory.' });
  }
};

export const deleteMemory = async (req: AuthRequest, res: Response) => {
  try {
    const memory = await Memory.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory not found.' });
    }
    return res.json({ success: true, message: 'Memory deleted from album.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete memory.' });
  }
};
