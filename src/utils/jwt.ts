import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from '../modules/auth/auth.interface';

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
