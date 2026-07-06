import { Router } from 'express';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';

const router = Router();

router.post('/login', authController.loginUser);
router.get(
   '/me',
   auth(UserRole.USER, UserRole.ADMIN, UserRole.LANDLORD),
   authController.getProfile
);

export const authRoutes = router;
