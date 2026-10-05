import { Request, Response } from 'express';
import { Destination } from '../models/Destination';

export const getAllDestinations = async (req: Request, res: Response) => {
  try {
    const { search, category, state, featured } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { state: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (state) {
      filter.state = { $regex: String(state), $options: 'i' };
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    const destinations = await Destination.find(filter).sort({ featured: -1, createdAt: -1 });
    return res.json({ success: true, count: destinations.length, destinations });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch destinations.' });
  }
};

export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }
    return res.json({ success: true, destination });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch destination.' });
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.create(req.body);
    return res.status(201).json({ success: true, message: 'Destination created successfully!', destination });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Error creating destination.' });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }
    return res.json({ success: true, message: 'Destination updated successfully!', destination });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Error updating destination.' });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }
    return res.json({ success: true, message: 'Destination deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error deleting destination.' });
  }
};
