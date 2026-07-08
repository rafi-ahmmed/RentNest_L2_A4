import { SignOptions } from 'jsonwebtoken';
import config from '../../config/index.js';
import { prisma } from '../../lib/prisma.js';
import { createToken } from '../../utils/jwt.js';
import { ILoginUser } from './auth.interface.js';
import bcrypt from 'bcryptjs';
import AppError from '../../errors/appError.js';
import httpStatus from 'http-status';

const loginUser = async (payload: ILoginUser) => {
   const { email, password } = payload;
   if (!email) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Email is Required');
   } else if (!password) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Password is Required');
   }

   const user = await prisma.user.findUnique({
      where: { email },
   });

   if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
   }

   const isPasswordVerified = await bcrypt.compare(password, user.password);

   if (!isPasswordVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Incorrect Password!');
   }

   // console.log(isPasswordVerified);

   const jwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
   };

   // console.log(config.jwt_access_secret);

   const accessToken = createToken(
      jwtPayload,
      config.jwt_access_tkn_secret,
      config.jwt_access_expires_in as SignOptions
   );
   const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_tkn_secret,
      config.jwt_refresh_expires_in as SignOptions
   );

   return {
      accessToken,
      refreshToken,
   };
};

const getProfile = async (userId: string, email: string) => {
   const user = await prisma.user.findFirst({
      where: {
         id: userId,
         email: email,
      },
      omit: {
         password: true,
      },
   });

   if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
   }

   return user;
};

export const authServices = { loginUser, getProfile };
