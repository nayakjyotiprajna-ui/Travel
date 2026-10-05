import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Journey } from '../models/Journey';
import { User } from '../models/User';
import { Destination } from '../models/Destination';
import { PassportEntry } from '../models/PassportEntry';

export const startJourney = async (req: AuthRequest, res: Response) => {
  try {
    const { destinationId, mode, preferences, comfortMode, stops, activities } = req.body;

    if (!destinationId) {
      return res.status(400).json({ success: false, message: 'destinationId is required.' });
    }

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    const initialStops = stops && stops.length > 0
      ? stops
      : destination.attractions.map((a) => ({ name: a.name, description: a.description, completed: false }));

    const initialActivities = activities && activities.length > 0
      ? activities
      : destination.activities.map((act) => ({ activityId: act.id, title: act.title, completed: false }));

    const journey = await Journey.create({
      userId: req.user?.id,
      destinationId,
      mode: mode || 'virtual',
      preferences: preferences || [],
      comfortMode: comfortMode || 'Standard',
      stops: initialStops,
      activities: initialActivities,
      status: 'in-progress',
      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Journey commenced! Safe virtual travels.',
      journey,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to start journey.' });
  }
};

export const getAllUserJourneys = async (req: AuthRequest, res: Response) => {
  try {
    const journeys = await Journey.find({ userId: req.user?.id })
      .populate('destinationId', 'name state country bannerImage category')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: journeys.length, journeys });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch journeys.' });
  }
};

export const getJourneyById = async (req: AuthRequest, res: Response) => {
  try {
    const journey = await Journey.findOne({ _id: req.params.id, userId: req.user?.id })
      .populate('destinationId');

    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found.' });
    }

    return res.json({ success: true, journey });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch journey.' });
  }
};

export const completeJourney = async (req: AuthRequest, res: Response) => {
  try {
    const { activityScores, stopsCompleted } = req.body;
    const journey = await Journey.findOne({ _id: req.params.id, userId: req.user?.id });

    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found.' });
    }

    if (journey.status === 'completed') {
      return res.json({ success: true, message: 'Journey was already marked complete.', journey });
    }

    journey.status = 'completed';
    journey.completedAt = new Date();
    const xpReward = 300; // Base completion XP
    journey.xpAwarded = xpReward;

    if (stopsCompleted && Array.isArray(stopsCompleted)) {
      journey.stops.forEach((s) => {
        if (stopsCompleted.includes(s.name)) s.completed = true;
      });
    }

    await journey.save();

    // Award XP to user and calculate level
    const user = await User.findById(req.user?.id);
    let levelUp = false;
    if (user) {
      user.xp += xpReward;
      const newLevel = Math.floor(user.xp / 500) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        levelUp = true;
      }
      await user.save();
    }

    // Create or update digital passport entry
    const destination = await Destination.findById(journey.destinationId);
    let passportEntry = null;

    if (destination) {
      passportEntry = await PassportEntry.findOneAndUpdate(
        { userId: req.user?.id, destinationId: destination._id },
        {
          userId: req.user?.id,
          destinationId: destination._id,
          destinationName: destination.name,
          category: destination.category,
          stamp: {
            code: `TT-${destination.name.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
            title: `${destination.name} Explorer Stamp`,
            icon: destination.category === 'Mountains' ? '🏔️' : destination.category === 'Beaches' ? '🏖️' : '🏛️',
            color: '#14B8A6',
            issuedAt: new Date(),
          },
          badge: {
            name: `${destination.name} Master Explorer`,
            icon: '🏆',
            description: `Successfully completed virtual immersion in ${destination.name}.`,
            tier: 'Gold',
          },
          xpEarned: xpReward,
          completedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    return res.json({
      success: true,
      message: 'Congratulations! Journey completed and Passport updated!',
      journey,
      xpAwarded: xpReward,
      levelUp,
      newLevel: user?.level,
      passportEntry,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to complete journey.' });
  }
};
