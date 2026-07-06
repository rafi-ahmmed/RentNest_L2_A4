import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { adminServices } from './admin.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createCategory = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;

      const result = await adminServices.createCategory(payload);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Category Created successfully!',
         data: result,
      });
   }
);

export const adminControllers = {
   createCategory,
};
