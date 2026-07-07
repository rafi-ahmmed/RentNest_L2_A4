import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { paymentServices } from './payment.service';

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

export const paymentControllers = {
   createPaymentIntent,
};
