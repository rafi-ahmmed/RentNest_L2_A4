import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { IRegisterUserPayload } from './user.interface';
import config from '../../config';
import { UserRole } from '../../../generated/prisma/enums';

const registerUserInDb = async (payload: IRegisterUserPayload) => {
   const { name, email, password, image, role } = payload;
   if (!email) {
      throw new Error('Email is Required');
   } else if (!password) {
      throw new Error('Password is Required');
   }

   const isUserExist = await prisma.user.findUnique({
      where: {
         email,
      },
   });

   if (isUserExist) {
      throw new Error('User already exist!');
   }

   if (role === UserRole.ADMIN) {
      throw new Error(
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
