import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import { userServices } from './user.service.js';
import sendResponse from '../../utils/sendResponse.js';
import httpStatus from 'http-status';

const registerUser = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      // console.log(payload);

      const result = await userServices.registerUserInDb(payload);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'User registered successfully',
         data: result,
      });
   }
);

export const userControllers = { registerUser };
