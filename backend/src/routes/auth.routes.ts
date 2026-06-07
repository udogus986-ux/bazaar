import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register → Kayıt ol (herkese açık)
router.post('/register', register);

// POST /api/auth/login → Giriş yap (herkese açık)
router.post('/login', login);

// GET /api/auth/me → Kim olduğumu öğren (giriş yapmış olmalı)
// authenticate middleware önce çalışır, token geçerliyse getMe çalışır
router.get('/me', authenticate, getMe);

export default router;