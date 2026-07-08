import { Router } from 'express';
import { authController } from './auth.controller.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/prisma/enums.js';

const router = Router();

router.post('/login', authController.loginUser);
router.get(
   '/me',
   auth(UserRole.USER, UserRole.ADMIN, UserRole.LANDLORD),
   authController.getProfile
);

export const authRoutes = router;
