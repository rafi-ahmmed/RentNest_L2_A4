import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { verifyTkn } from '../utils/jwt';
import config from '../config';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';
import { prisma } from '../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';
import { UserRole, UserStatus } from '../../generated/prisma/enums';

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
         console.log('Hitted middleaware');

         const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith('Bearer ')
              ? req.headers.authorization.split(' ')[1]
              : req.headers.authorization;

         if (!token) {
            throw new Error('You are not logged in..');
         }

         const decodedData = verifyTkn(token, config.jwt_access_tkn_secret);
         if (!decodedData.success) {
            throw new Error('Invalid Token!');
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
            throw new Error(
               "Forbidden: You don't have permission to access this resource!"
            );
         }

         if (!user) {
            throw new Error('User not found!');
         }

         if (user.status === UserStatus.BAN) {
            throw new Error('You are banned. Contact support!');
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
