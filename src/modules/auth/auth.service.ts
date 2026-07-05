import { SignOptions } from 'jsonwebtoken';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import { createToken } from '../../utils/jwt';
import { ILoginUser } from './auth.interface';
import bcrypt from 'bcryptjs';

const loginUser = async (payload: ILoginUser) => {
   const user = await prisma.user.findUnique({
      where: { email: payload.email },
   });

   if (!user) {
      throw new Error('User not found');
   }

   const isPasswordVerified = await bcrypt.compare(
      payload.password,
      user.password
   );

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

export const authServices = { loginUser };
