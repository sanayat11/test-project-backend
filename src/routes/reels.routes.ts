import { Router } from 'express';
import { getReels, getReelById, syncReel, deleteReel } from '../controllers/reels.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.get('/', getReels as any);
router.post('/sync', syncReel as any);
router.get('/:id', getReelById as any);
router.delete('/:id', deleteReel as any);

export default router;
