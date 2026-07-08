import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import httpStatus from 'http-status';
import { reviewServices } from './review.service.js';

const postReview = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      const userId = req.user?.id as string;

      const result = await reviewServices.postReview(payload, userId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Review Created successfully',
         data: result,
      });
   }
);

export const reviewControllers = {
   postReview,
};
