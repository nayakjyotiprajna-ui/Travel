import { Router } from 'express';
import { getPassport, unlockDestinationStamp } from '../controllers/passportController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getPassport);
router.post('/unlock', unlockDestinationStamp);

export default router;
