import { Router } from 'express';
import { login, logout, getMe, getDemoUsers } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken as any, getMe as any);
router.get('/demo-users', getDemoUsers);

export default router;
