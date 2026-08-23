import { Router } from 'express';
import { getOverview, getViewsTimeline, getTopReels } from '../controllers/analytics.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.get('/overview', getOverview as any);
router.get('/views', getViewsTimeline as any);
router.get('/top-reels', getTopReels as any);

export default router;
