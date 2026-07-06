import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

const createRentalReq = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);
const getAllRentalReq = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);
const getRentalReqById = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

export const rentalRequestControllers = {
   createRentalReq,
   getAllRentalReq,
   getRentalReqById,
};
