import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PassportEntry } from '../models/PassportEntry';
import { Destination } from '../models/Destination';
import { User } from '../models/User';

export const getPassport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select('-passwordHash');
    const unlockedEntries = await PassportEntry.find({ userId }).populate('destinationId');
    const allDestinations = await Destination.find().select('name state country bannerImage category');

    const unlockedDestIds = new Set(unlockedEntries.map((e) => e.destinationId?._id?.toString() || e.destinationId?.toString()));

    const passportDestinations = allDestinations.map((d) => ({
      _id: d._id,
      name: d.name,
      state: d.state,
      country: d.country,
      bannerImage: d.bannerImage,
      category: d.category,
      isUnlocked: unlockedDestIds.has(d._id.toString()),
    }));

    return res.json({
      success: true,
      passport: {
        passportId: `TT-${user?._id?.toString().slice(-8).toUpperCase()}`,
        user: {
          name: user?.name,
          email: user?.email,
          avatar: user?.avatar,
          level: user?.level || 1,
          xp: user?.xp || 0,
          travellerType: user?.travellerType || 'Explorer',
        },
        unlockedCount: unlockedEntries.length,
        totalDestinations: allDestinations.length,
        entries: unlockedEntries,
        destinationsStatus: passportDestinations,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch passport.' });
  }
};

export const unlockDestinationStamp = async (req: AuthRequest, res: Response) => {
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

    const existingEntry = await PassportEntry.findOne({ userId, destinationId });
    if (existingEntry) {
      return res.json({ success: true, message: 'Stamp already unlocked!', entry: existingEntry });
    }

    const xpEarned = 250;

    const entry = await PassportEntry.create({
      userId,
      destinationId: destination._id,
      destinationName: destination.name,
      category: destination.category,
      stamp: {
        code: `STAMP-${destination.name.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        title: `${destination.name} Explorer Stamp`,
        icon: destination.category === 'Mountains' ? '🏔️' : destination.category === 'Beaches' ? '🏖️' : '🏛️',
        color: '#06B6D4',
        issuedAt: new Date(),
      },
      badge: {
        name: `${destination.name} Pioneer`,
        icon: '🎖️',
        description: `Awarded for exploring the wonders of ${destination.name}.`,
        tier: 'Gold',
      },
      xpEarned,
      completedAt: new Date(),
    });

    const user = await User.findById(userId);
    if (user) {
      user.xp += xpEarned;
      user.level = Math.floor(user.xp / 500) + 1;
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: `Congratulations! Unlocked ${destination.name} Passport Stamp and Badge!`,
      entry,
      xpEarned,
      currentXp: user?.xp,
      currentLevel: user?.level,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to unlock stamp.' });
  }
};
