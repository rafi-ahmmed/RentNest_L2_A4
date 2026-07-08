import { Router } from 'express';
import { paymentControllers } from './payment.controller.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/prisma/enums.js';

const router = Router();

router.post('/', auth(UserRole.USER), paymentControllers.createPaymentIntent);
router.post('/webhook', paymentControllers.handleWebHook);

router.get('/success', paymentControllers.paymentSuccess);
router.get('/failed', paymentControllers.paymentFailed);

router.get('/', auth(UserRole.USER), paymentControllers.getUserPayments);
router.get('/:id', auth(UserRole.USER), paymentControllers.getPaymentsById);

export const paymentsRoutes = router;
