import { Router } from 'express';
import { adminControllers } from './admin.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';

const router = Router();

router.post(
   '/categories',
   auth(UserRole.ADMIN),
   adminControllers.createCategory
);

export const adminRoutes = router;
