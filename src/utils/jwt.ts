import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from '../modules/auth/auth.interface.js';

export const createToken = (
   payload: IJwtPayload,
   jwtSecret: string,
   expire: SignOptions
) => {
   const token = jwt.sign(payload, jwtSecret, {
      expiresIn: expire,
   } as SignOptions);

   return token;
};

export const verifyTkn = (token: string, secret: string) => {
   try {
      const decoded = jwt.verify(token, secret);

      return {
         success: true,
         data: decoded,
      };
   } catch (error: any) {
      // console.log(error);
      return {
         success: false,
         error: error.message || 'Invalid Token',
      };
   }
};
