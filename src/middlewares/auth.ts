import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync.js';
import { verifyTkn } from '../utils/jwt.js';
import config from '../config/index.js';
import sendResponse from '../utils/sendResponse.js';
import httpStatus from 'http-status';
import { prisma } from '../lib/prisma.js';
import { JwtPayload } from 'jsonwebtoken';
import { UserRole, UserStatus } from '../../generated/prisma/enums.js';
import AppError from '../errors/appError.js';

declare global {
   namespace Express {
      interface Request {
         user?: {
            id: string;
            email: string;
            role: UserRole;
         };
      }
   }
}

const auth = (...requiredRoles: UserRole[]) => {
   return catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
         // console.log('Hitted middleaware');

         const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith('Bearer ')
              ? req.headers.authorization.split(' ')[1]
              : req.headers.authorization;

         if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED,'You are not logged in..');
         }

         const decodedData = verifyTkn(token, config.jwt_access_tkn_secret);
         if (!decodedData.success) {
            throw new AppError(httpStatus.UNAUTHORIZED,'Invalid Access Token!');
         }

         const { id, email, role } = decodedData.data as JwtPayload;

         const user = await prisma.user.findUnique({
            where: {
               id,
               email,
               role,
            },
         });

         if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED,
               "Forbidden: You don't have permission to access this resource!"
            );
         }

         if (!user) {
            throw new AppError(httpStatus.NOT_FOUND,'User not found!');
         }

         if (user.status === UserStatus.BAN) {
            throw new AppError(httpStatus.FORBIDDEN,'You are banned. Contact support!');
         }

         req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
         };

         next();
      }
   );
};

export default auth;
