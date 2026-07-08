import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import { adminServices } from './admin.service.js';
import sendResponse from '../../utils/sendResponse.js';
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

const getAllUsers = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const result = await adminServices.getAllUsers();

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Users retrieved successfully',
         data: result.data,
         meta: {
            total: result.totalCount,
         },
      });
   }
);

const updateUserStatus = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      const userId = req.params.id as string;

      const result = await adminServices.updateUserStatus(payload, userId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'User status updated successfully!',
         data: result,
      });
   }
);

const getAllProperties = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const result = await adminServices.getAllProperties();

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'All properties retrieved successful',
         data: result.data,
         meta: {
            total: result.totalCount,
         },
      });
   }
);

const getAllRentalRequest = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const result = await adminServices.getAllRentalRequest();

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'All rental requests retrieved successful',
         data: result,
      });
   }
);

export const adminControllers = {
   createCategory,
   getAllUsers,
   updateUserStatus,
   getAllProperties,
   getAllRentalRequest,
};
