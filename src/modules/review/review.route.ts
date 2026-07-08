import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/prisma/enums.js';

import { reviewControllers } from './review.controller.js';

const router = Router();

router.post('/', auth(UserRole.USER), reviewControllers.postReview);

export const reviewRoutes = router;
