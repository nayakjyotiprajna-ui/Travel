import { Router } from 'express';
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);
router.post('/', authenticate, requireAdmin, createDestination);
router.put('/:id', authenticate, requireAdmin, updateDestination);
router.delete('/:id', authenticate, requireAdmin, deleteDestination);

export default router;
