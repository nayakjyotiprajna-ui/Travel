import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import { Destination } from './models/Destination';
import { User } from './models/User';
import { PassportEntry } from './models/PassportEntry';
import { Memory } from './models/Memory';
import { defaultDestinations } from './utils/seedData';

export const runSeed = async () => {
  console.log('[Seed] Starting TravelTwin database seed...');
  
  // Only connect if not already connected (avoid double-connect when called from server.ts)
  const mongoose = await import('mongoose');
  if (mongoose.default.connection.readyState !== 1) {
    await connectDB();
  }

  try {
    // 1. Seed Destinations
    console.log('[Seed] Seeding destinations...');
    for (const dest of defaultDestinations) {
      await Destination.findOneAndUpdate({ name: dest.name }, dest, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${defaultDestinations.length} destinations successfully.`);

    // 2. Seed Default Admin & Demo User
    const passwordHash = await bcrypt.hash('traveltwin2026', 10);

    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@traveltwin.com' },
      {
        name: 'TravelTwin Admin',
        email: 'admin@traveltwin.com',
        passwordHash,
        role: 'admin',
        travellerType: 'Explorer & Architect',
        travelPreferences: ['Mountains', 'Heritage', 'Culture'],
        xp: 1200,
        level: 3,
      },
      { upsert: true, new: true }
    );

    const demoUser = await User.findOneAndUpdate(
      { email: 'demo@traveltwin.com' },
      {
        name: 'Aria Sharma',
        email: 'demo@traveltwin.com',
        passwordHash,
        role: 'user',
        travellerType: 'Peaceful Traveller',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        travelPreferences: ['Mountains', 'Culture', 'Peaceful'],
        accessibilityPreferences: {
          lowMotion: false,
          audioGuide: true,
          textGuide: true,
          seniorFriendly: false,
          mobilityFriendly: false,
          enhancedVisuals: true,
          highContrast: false,
          largeText: false,
        },
        xp: 650,
        level: 2,
      },
      { upsert: true, new: true }
    );

    // 3. Seed Demo Passport & Memory for Demo User
    const kashmir = await Destination.findOne({ name: 'Kashmir' });
    if (kashmir && demoUser) {
      await PassportEntry.findOneAndUpdate(
        { userId: demoUser._id, destinationId: kashmir._id },
        {
          userId: demoUser._id,
          destinationId: kashmir._id,
          destinationName: kashmir.name,
          category: kashmir.category,
          stamp: {
            code: 'TT-KAS-401',
            title: 'Kashmir Alpine Explorer',
            icon: '🏔️',
            color: '#14B8A6',
            issuedAt: new Date(Date.now() - 86400000 * 2),
          },
          badge: {
            name: 'Kashmir Explorer',
            icon: '🏆',
            description: 'Successfully experienced Dal Lake & Gulmarg',
            tier: 'Gold',
          },
          xpEarned: 350,
          completedAt: new Date(Date.now() - 86400000 * 2),
        },
        { upsert: true }
      );

      await Memory.findOneAndUpdate(
        { userId: demoUser._id, destinationId: kashmir._id },
        {
          userId: demoUser._id,
          destinationId: kashmir._id,
          destinationName: kashmir.name,
          imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Sunset across Dal Lake from a quiet cedar shikara. Perfectly peaceful.',
          sceneName: 'Dal Lake Golden Hour',
          tags: ['Peaceful', 'Mountains', 'Sunset'],
        },
        { upsert: true }
      );
    }

    console.log('[Seed] Successfully seeded users, demo passport entries, and memories!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS READY:');
    console.log('1. Admin: admin@traveltwin.com / traveltwin2026');
    console.log('2. User:  demo@traveltwin.com  / traveltwin2026');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

if (require.main === module) {
  runSeed().then(() => {
    console.log('[Seed] Finished.');
    process.exit(0);
  });
}
