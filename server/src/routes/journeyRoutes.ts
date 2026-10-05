import { Router } from 'express';
import {
  startJourney,
  getAllUserJourneys,
  getJourneyById,
  completeJourney,
} from '../controllers/journeyController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', startJourney);
router.get('/', getAllUserJourneys);
router.get('/:id', getJourneyById);
router.put('/:id/complete', completeJourney);

export default router;
