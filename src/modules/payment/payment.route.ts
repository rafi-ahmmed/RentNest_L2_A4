import { Router } from 'express';
import { paymentControllers } from './payment.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';

const router = Router();

router.post('/', auth(UserRole.USER), paymentControllers.createPaymentIntent);
router.post('/webhook', paymentControllers.handleWebHook);
router.get('/', auth(UserRole.USER), paymentControllers.getUserPayments);
router.get('/:id', auth(UserRole.USER), paymentControllers.getPaymentsById);

export const paymentsRoutes = router;
