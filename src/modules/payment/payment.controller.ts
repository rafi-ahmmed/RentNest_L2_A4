import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';

import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse.js';
import { paymentServices } from './payment.service.js';
import config from '../../config/index.js';

const createPaymentIntent = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const { requestId } = req.body;
      const tenantId = req.user?.id;
      const userEmail = req.user?.email;

      const result = await paymentServices.createPaymentIntent(
         requestId as string,
         tenantId as string,
         userEmail as string
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Your payment session created',
         data: result,
      });
   }
);

const handleWebHook = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      console.log('🔥 Webhook Controller Hit');
      let event = req.body;
      const signature = req.headers['stripe-signature'] as string;

      // console.log(event);
      // console.log('================', signature);

      await paymentServices.handleWebhook(event, signature);
      sendResponse(res, {
         success: true,
         statusCode: 200,
         message: 'Webhook triggered successfully',
         data: {},
      });
   }
);

const getUserPayments = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?.id as string;

      const result = await paymentServices.getUserPayments(userId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Your payment records retrieved successfully',
         data: result.data,
         meta: {
            total: result.total,
         },
      });
   }
);

const getPaymentsById = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id as string;
      const userId = req.user?.id as string;

      const result = await paymentServices.getPaymentsById(id, userId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Your payment records retrieved successfully',
         data: result,
      });
   }
);

const paymentSuccess = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      res.json({
         success: true,
         message: 'Your Payment Completed successfully',
      });
   }
);
const paymentFailed = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      res.json({
         success: false,
         message: 'Your Payment Failed',
      });
   }
);

export const paymentControllers = {
   createPaymentIntent,
   handleWebHook,
   getUserPayments,
   getPaymentsById,
   paymentSuccess,
   paymentFailed,
};
