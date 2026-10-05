import { Router } from 'express';
import { createRoom, joinRoom, getRoomByCode } from '../controllers/roomController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createRoom);
router.post('/join', joinRoom);
router.get('/:code', getRoomByCode);

export default router;
