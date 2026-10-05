import { Router } from 'express';
import {
  getTravelDirectorJourney,
  getDestinationGuide,
  generateTravelPlan,
} from '../controllers/aiController';

const router = Router();

router.post('/travel-twin', getTravelDirectorJourney);
router.post('/destination-guide', getDestinationGuide);
router.post('/travel-plan', generateTravelPlan);

export default router;
