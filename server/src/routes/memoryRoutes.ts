import { Router } from 'express';
import { getMemories, createMemory, deleteMemory } from '../controllers/memoryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getMemories);
router.post('/', createMemory);
router.delete('/:id', deleteMemory);

export default router;
