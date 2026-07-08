import { Router } from 'express';

import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/prisma/enums.js';
import { rentalRequestControllers } from './rentalRequest.controller.js';

const router = Router();

router.post('/', auth(UserRole.USER), rentalRequestControllers.createRentalReq);
router.get('/', auth(UserRole.USER), rentalRequestControllers.getAllRentalReq);
router.get(
   '/:id',
   auth(UserRole.USER),
   rentalRequestControllers.getRentalReqById
);

export const rentalRequestRoutes = router;
