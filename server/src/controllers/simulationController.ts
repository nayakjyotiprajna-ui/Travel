import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Simulation } from '../models/Simulation';
import { Destination } from '../models/Destination';
import { AIService } from '../services/aiService';

export const createSimulation = async (req: AuthRequest, res: Response) => {
  try {
    const {
      destinationId,
      travelDates,
      travellers,
      budget,
      transport,
      accommodation,
      preferences,
      accessibilityRequirements,
    } = req.body;

    if (!destinationId) {
      return res.status(400).json({ success: false, message: 'destinationId is required.' });
    }

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    const durationDays = travelDates?.durationDays || 3;
    const travellersCount = Number(travellers) || 1;
    const budgetRange = budget?.range || 'Moderate';

    // Build the Simulation Stages Results
    const hotelCostPerNight = destination.simulationDefaults?.avgHotelPrice || 80;
    const hotelMultiplier = budgetRange === 'Budget' ? 0.6 : budgetRange === 'Luxury' ? 2.5 : 1.0;
    const estimatedHotelCost = Math.round(hotelCostPerNight * hotelMultiplier * durationDays);

    const simulationResults = {
      hotelScenario: {
        name: `${destination.name} ${accommodation || 'Heritage Boutique Resort'}`,
        type: accommodation || 'Boutique Heritage Resort',
        costEstimate: estimatedHotelCost,
        rating: 4.8,
        accessibilityScore: 92,
        previewDescription: `Comfortable stay featuring level access, quiet sensory quarters, and proximity to scenic viewpoints.`,
      },
      transportScenario: {
        mode: transport || 'Scenic Cab & Flight',
        travelTimeHours: 3.5,
        scenicRating: 4.9,
        accessibilityNotes: 'Air-conditioned transit with low vibration suspension and step-assist boarding.',
      },
      touristPlaceScenario: {
        highlights: destination.attractions.slice(0, 3).map((a) => a.name),
        crowdLevel: 'Moderate to Low in morning hours',
        bestTimeOfDay: '07:30 AM - 10:30 AM & 04:30 PM - 06:30 PM',
      },
      crowdScenario: {
        level: 'Moderate' as const,
        percentage: 42,
        recommendation: 'Plan major monument visits before 10 AM to enjoy serene, uncrowded atmosphere.',
      },
      weatherScenario: {
        forecast: destination.simulationDefaults?.bestSeason || 'Crisp & Pleasant',
        tempCelsius: destination.category === 'Mountains' ? 14 : 27,
        condition: 'Clear skies with mild mountain breezes',
        packingTips: destination.category === 'Mountains'
          ? ['Layered thermal fleece', 'Comfortable walking boots', 'UV sunglasses']
          : ['Sun protection hat', 'Light cotton attire', 'Hydration canteen'],
      },
      activitiesScenario: destination.activities.slice(0, 3).map((act) => ({
        title: act.title,
        estimatedTime: act.duration,
        budgetImpact: act.difficulty === 'Challenging' ? 'Included / Guide optional' : 'Complimentary / Included',
      })),
    };

    // Generate AI Travel Plan
    const aiPlan = await AIService.generatePersonalizedTravelPlan({
      destination: destination.name,
      durationDays,
      travellers: travellersCount,
      budgetRange,
      preferences: preferences || destination.category ? [destination.category] : ['Peaceful'],
      transportPreference: transport || 'Scenic Cab',
      accommodationPreference: accommodation || 'Heritage Resort',
      accessibilityRequirements: accessibilityRequirements || ['Text Guide', 'Step-Free Access'],
    });

    const simulation = await Simulation.create({
      userId: req.user?.id,
      destinationId,
      travelDates: {
        start: travelDates?.start || new Date().toISOString().split('T')[0],
        end: travelDates?.end || new Date(Date.now() + 86400000 * durationDays).toISOString().split('T')[0],
        durationDays,
      },
      travellers: travellersCount,
      budget: {
        range: budgetRange,
        amount: aiPlan.estimatedTotalCost,
        currency: 'USD',
      },
      transport: transport || 'Scenic Cab',
      accommodation: accommodation || 'Heritage Resort',
      preferences: preferences || [],
      accessibilityRequirements: accessibilityRequirements || [],
      simulationResults,
      aiPlan,
    });

    return res.status(201).json({
      success: true,
      message: 'Trip simulation generated successfully!',
      simulation,
    });
  } catch (error: any) {
    console.error('[Simulation Error]', error);
    return res.status(500).json({ success: false, message: error.message || 'Error generating simulation.' });
  }
};

export const getAllUserSimulations = async (req: AuthRequest, res: Response) => {
  try {
    const simulations = await Simulation.find({ userId: req.user?.id })
      .populate('destinationId', 'name state country bannerImage category')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: simulations.length, simulations });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch simulations.' });
  }
};

export const getSimulationById = async (req: AuthRequest, res: Response) => {
  try {
    const simulation = await Simulation.findOne({ _id: req.params.id, userId: req.user?.id })
      .populate('destinationId');

    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Simulation not found.' });
    }

    return res.json({ success: true, simulation });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch simulation.' });
  }
};
