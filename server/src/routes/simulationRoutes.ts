import { Router } from 'express';
import {
  createSimulation,
  getAllUserSimulations,
  getSimulationById,
} from '../controllers/simulationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createSimulation);
router.get('/', getAllUserSimulations);
router.get('/:id', getSimulationById);

export default router;
