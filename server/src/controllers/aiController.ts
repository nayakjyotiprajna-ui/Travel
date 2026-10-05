import { Request, Response } from 'express';
import { AIService } from '../services/aiService';

export const getTravelDirectorJourney = async (req: Request, res: Response) => {
  try {
    const { destination, mood, preferences, comfortMode, duration } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: 'destination name is required.' });
    }

    const journey = await AIService.generateTravelDirectorJourney({
      destination,
      mood: mood || 'peaceful',
      preferences: preferences || ['Scenic', 'Cultural'],
      comfortMode: comfortMode || 'Standard',
      duration,
    });

    return res.json({ success: true, journey });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'AI Travel Director failed.' });
  }
};

export const getDestinationGuide = async (req: Request, res: Response) => {
  try {
    const { destination, currentAttraction, question, userAccessibilityNeeds } = req.body;

    if (!destination || !question) {
      return res.status(400).json({ success: false, message: 'destination and question are required.' });
    }

    const answer = await AIService.answerGuideQuestion({
      destination,
      currentAttraction,
      question,
      userAccessibilityNeeds,
    });

    return res.json({ success: true, answer });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'AI Guide failed.' });
  }
};

export const generateTravelPlan = async (req: Request, res: Response) => {
  try {
    const {
      destination,
      durationDays,
      travellers,
      budgetRange,
      preferences,
      transportPreference,
      accommodationPreference,
      accessibilityRequirements,
    } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: 'destination is required.' });
    }

    const plan = await AIService.generatePersonalizedTravelPlan({
      destination,
      durationDays: Number(durationDays) || 3,
      travellers: Number(travellers) || 1,
      budgetRange: budgetRange || 'Moderate',
      preferences: preferences || [],
      transportPreference: transportPreference || 'Scenic Cab',
      accommodationPreference: accommodationPreference || 'Boutique Hotel',
      accessibilityRequirements: accessibilityRequirements || [],
    });

    return res.json({ success: true, plan });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'AI Trip Planner failed.' });
  }
};
