import { Router } from 'express';
import { getProfile, updateProfile, syncInstagramAccount } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.get('/', getProfile as any);
router.put('/', updateProfile as any);
router.post('/sync-instagram', syncInstagramAccount as any);

export default router;
