import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';

import { reviewControllers } from './review.controller';

const router = Router();

router.post('/', auth(UserRole.USER), reviewControllers.postReview);

export const reviewRoutes = router;
