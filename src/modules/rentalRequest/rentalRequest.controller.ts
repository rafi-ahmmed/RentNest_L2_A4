import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import httpStatus from 'http-status';
import { rentalRequestServices } from './rentalRequest.service.js';

const createRentalReq = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      const tenantId = req.user?.id as string;
      // console.log(payload);

      const result = await rentalRequestServices.createRentalReq(
         payload,
         tenantId
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Rental request submitted successfully.',
         data: result,
      });
   }
);

const getAllRentalReq = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const tenantId = req.user?.id as string;

      const result = await rentalRequestServices.getAllRentalReq(tenantId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'all Rental request Retrieved successfully.',
         data: result.data,
         meta: {
            total: result.total,
         },
      });
   }
);

const getRentalReqById = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const reqId = req.params.id as string;
      const tenantId = req.user?.id as string;

      const result = await rentalRequestServices.getRentalReqById(
         reqId,
         tenantId
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: ' Rental request Retrieved  successfully.',
         data: result,
      });
   }
);

export const rentalRequestControllers = {
   createRentalReq,
   getAllRentalReq,
   getRentalReqById,
};
