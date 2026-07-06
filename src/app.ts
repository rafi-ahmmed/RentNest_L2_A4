import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';
import { notFound } from './middlewares/notFound';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { userControllers } from './modules/user/user.controller';
import { userRoutes } from './modules/user/user.route';
import { authRoutes } from './modules/auth/auth.route';
import { propertyRoutes } from './modules/property/property.route';
import { adminRoutes } from './modules/admin/admin.route';
import { rentalRequestRoutes } from './modules/rentalRequest/rentalRequest.route';


const app: Application = express();

// For webhook

// Middlewares
app.use(
   cors({
      origin: config.app_url,
      credentials: true,
   })
);

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

app.use(notFound);
app.use(globalErrorHandler);

export default app;
