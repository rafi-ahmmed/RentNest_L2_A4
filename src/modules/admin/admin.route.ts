import { Router } from 'express';
import { adminControllers } from './admin.controller.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/prisma/enums.js';

const router = Router();

router.post(
   '/categories',
   auth(UserRole.ADMIN),
   adminControllers.createCategory
);

router.get('/users', auth(UserRole.ADMIN), adminControllers.getAllUsers);
router.patch(
   '/users/:id',
   auth(UserRole.ADMIN),
   adminControllers.updateUserStatus
);
router.get(
   '/properties',
   auth(UserRole.ADMIN),
   adminControllers.getAllProperties
);
router.get(
   '/rentals',
   auth(UserRole.ADMIN),
   adminControllers.getAllRentalRequest
);

export const adminRoutes = router;
