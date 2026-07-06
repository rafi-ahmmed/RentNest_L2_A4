import { SignOptions } from 'jsonwebtoken';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import { createToken } from '../../utils/jwt';
import { ILoginUser } from './auth.interface';
import bcrypt from 'bcryptjs';

const loginUser = async (payload: ILoginUser) => {
   const { email, password } = payload;
   if (!email) {
      throw new Error('Email is Required');
   } else if (!password) {
      throw new Error('Password is Required');
   }

   const user = await prisma.user.findUnique({
      where: { email },
   });

   if (!user) {
      throw new Error('User not found');
   }

   const isPasswordVerified = await bcrypt.compare(password, user.password);

   if (!isPasswordVerified) {
      throw new Error('Incorrect Password!');
   }

   console.log(isPasswordVerified);

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
   const user = await prisma.user.findFirstOrThrow({
      where: {
         id: userId,
         email: email,
      },
      omit: {
         password: true,
      },
   });

   return user;
};

export const authServices = { loginUser, getProfile };
