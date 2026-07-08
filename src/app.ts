import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config/index.js';
import cookieParser from 'cookie-parser';
import { notFound } from './middlewares/notFound.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { userControllers } from './modules/user/user.controller.js';
import { userRoutes } from './modules/user/user.route.js';
import { authRoutes } from './modules/auth/auth.route.js';
import { propertyRoutes } from './modules/property/property.route.js';
import { adminRoutes } from './modules/admin/admin.route.js';
import { rentalRequestRoutes } from './modules/rentalRequest/rentalRequest.route.js';
import { paymentsRoutes } from './modules/payment/payment.route.js';
import { reviewRoutes } from './modules/review/review.route.js';

const app: Application = express();

// Middlewares
app.use(
   cors({
      origin: config.app_url,
      credentials: true,
   })
);

// For webhook
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
   res.send('This server is for RentNest');
});

app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', propertyRoutes);

app.use('/api/rentals', rentalRequestRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/payments', paymentsRoutes);

app.use('/api/reviews', reviewRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
