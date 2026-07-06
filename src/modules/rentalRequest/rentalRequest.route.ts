import { Router } from 'express';

import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';
import { rentalRequestControllers } from './rentalRequest.controller';

const router = Router();

router.post('/', auth(UserRole.USER), rentalRequestControllers.createRentalReq);
router.get('/', auth(UserRole.USER), rentalRequestControllers.getAllRentalReq);
router.get(
   '/:id',
   auth(UserRole.USER),
   rentalRequestControllers.getRentalReqById
);

export const rentalRequestRoutes = router;
