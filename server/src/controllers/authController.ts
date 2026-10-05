import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (user: any) => {
  const secret = process.env.JWT_SECRET || 'traveltwin_jwt_secret_token_key_development_2026';
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    secret,
    { expiresIn: '7d' }
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, travelPreferences, accessibilityPreferences, travellerType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      travelPreferences: travelPreferences || ['Nature', 'Culture'],
      accessibilityPreferences: accessibilityPreferences || {
        lowMotion: false,
        audioGuide: false,
        textGuide: true,
        seniorFriendly: false,
        mobilityFriendly: false,
        enhancedVisuals: true,
        highContrast: false,
        largeText: false,
      },
      travellerType: travellerType || 'Explorer',
      xp: 100, // Welcome XP bonus!
      level: 1,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to TravelTwin.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        travelPreferences: newUser.travelPreferences,
        accessibilityPreferences: newUser.accessibilityPreferences,
        travellerType: newUser.travellerType,
        xp: newUser.xp,
        level: newUser.level,
      },
    });
  } catch (error: any) {
    console.error('[Register Error]', error);
    return res.status(500).json({ success: false, message: error.message || 'Error creating account.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Welcome back to TravelTwin!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        travelPreferences: user.travelPreferences,
        accessibilityPreferences: user.accessibilityPreferences,
        travellerType: user.travellerType,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error: any) {
    console.error('[Login Error]', error);
    return res.status(500).json({ success: false, message: error.message || 'Error logging in.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        travelPreferences: user.travelPreferences,
        accessibilityPreferences: user.accessibilityPreferences,
        travellerType: user.travellerType,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch user.' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, avatar, travelPreferences, accessibilityPreferences, travellerType } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (travelPreferences) user.travelPreferences = travelPreferences;
    if (accessibilityPreferences) user.accessibilityPreferences = { ...user.accessibilityPreferences, ...accessibilityPreferences };
    if (travellerType) user.travellerType = travellerType;

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        travelPreferences: user.travelPreferences,
        accessibilityPreferences: user.accessibilityPreferences,
        travellerType: user.travellerType,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update profile.' });
  }
};

export const resetTravelTwin = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.travelPreferences = [];
    user.travellerType = 'Explorer';
    user.accessibilityPreferences = {
      lowMotion: false,
      audioGuide: false,
      textGuide: true,
      seniorFriendly: false,
      mobilityFriendly: false,
      enhancedVisuals: true,
      highContrast: false,
      largeText: false,
    };

    await user.save();

    return res.json({
      success: true,
      message: 'Travel Twin preferences reset. You can now re-run the onboarding wizard.',
      user,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to reset preferences.' });
  }
};
