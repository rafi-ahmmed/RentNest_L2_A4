import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { IRegisterUserPayload } from './user.interface.js';
import config from '../../config/index.js';
import { UserRole } from '../../../generated/prisma/enums.js';
import HttpStatus from 'http-status';
import AppError from '../../errors/appError.js';

const registerUserInDb = async (payload: IRegisterUserPayload) => {
   const { name, email, password, image, role } = payload;
   if (!email) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Email is Required');
   } else if (!password) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Password is Required');
   }

   const isUserExist = await prisma.user.findUnique({
      where: {
         email,
      },
   });

   if (isUserExist) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'User already exist!');
   }

   if (role === UserRole.ADMIN) {
      throw new AppError(
         HttpStatus.BAD_REQUEST,
         'Admin accounts cannot be created through this registration.'
      );
   }

   const salt = Number(config.bcrypt_salt_rounds);

   const hashedPassword = await bcrypt.hash(password, salt);

   const result = await prisma.user.create({
      data: {
         name,
         email,
         password: hashedPassword,
         image,
         role,
      },
   });

   return result;
};

export const userServices = {
   registerUserInDb,
};
