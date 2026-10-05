import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Destination } from '../models/Destination';
import { Journey } from '../models/Journey';
import { Simulation } from '../models/Simulation';
import { Memory } from '../models/Memory';

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalDestinations,
      totalJourneys,
      totalSimulations,
      totalMemories,
      destinations,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Destination.countDocuments(),
      Journey.countDocuments(),
      Simulation.countDocuments(),
      Memory.countDocuments(),
      Destination.find().select('name category featured'),
      User.find().select('name email role xp level createdAt').sort({ createdAt: -1 }).limit(8),
    ]);

    // Aggregate category distribution
    const categoryCounts: Record<string, number> = {};
    destinations.forEach((d) => {
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryCounts).map((cat) => ({
      name: cat,
      value: categoryCounts[cat],
    }));

    // Mock/computed monthly visits for charts
    const monthlyData = [
      { month: 'Jan', virtualVisits: 140, simulations: 90 },
      { month: 'Feb', virtualVisits: 220, simulations: 160 },
      { month: 'Mar', virtualVisits: 310, simulations: 240 },
      { month: 'Apr', virtualVisits: 450, simulations: 310 },
      { month: 'May', virtualVisits: 620, simulations: 480 },
      { month: 'Jun', virtualVisits: 890, simulations: 650 },
    ];

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalDestinations,
        totalJourneys,
        totalSimulations,
        totalMemories,
        categoryDistribution,
        monthlyData,
        recentUsers,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch admin stats.' });
  }
};

export const getAdminUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch users.' });
  }
};
