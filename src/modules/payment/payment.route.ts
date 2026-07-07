import { Router } from 'express';
import { paymentControllers } from './payment.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';

const router = Router();

router.post('/', auth(UserRole.USER), paymentControllers.createPaymentIntent);

export const paymentsRoutes = router;
