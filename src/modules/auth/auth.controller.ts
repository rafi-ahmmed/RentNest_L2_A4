import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { authServices } from './auth.service';

const loginUser = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      // console.log(req.body);

      const result = await authServices.loginUser(req.body);

      const { accessToken, refreshToken } = result;

      res.cookie('accessToken', accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
         maxAge: 1000 * 60 * 60 * 24,
      });
      res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
         maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'User Login Successfully',
         data: null,
      });
   }
);

export const authController = {
   loginUser,
};
