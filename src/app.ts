import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';
import { notFound } from './middlewares/notFound';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

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



app.use(notFound);
app.use(globalErrorHandler);

export default app;
