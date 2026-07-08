import { UserStatus } from '../../../generated/prisma/enums.js';
import AppError from '../../errors/appError.js';
import { prisma } from '../../lib/prisma.js';
import httpStatus from 'http-status';

const createCategory = async (payload: { name: string }) => {
   const name = payload.name;

   if (!name) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Category name is required');
   }
   const result = await prisma.category.create({
      data: {
         name: name,
      },
   });

   return result;
};

const getAllUsers = async () => {
   const users = await prisma.user.findMany({
      omit: {
         password: true,
      },
   });
   const totalCount = await prisma.user.count();

   if (!users) {
      throw new AppError(httpStatus.NOT_FOUND, 'Users not found');
   }

  

  return { data: users, totalCount };
};

const updateUserStatus = async (
   payload: { status: string },
   userId: string
) => {
   const { status } = payload;

   let requiredUserStatus;

   if (status === 'ban') {
      requiredUserStatus = UserStatus.BAN;
   } else if (status === 'active') {
      requiredUserStatus = UserStatus.ACTIVE;
   } else {
      throw new AppError(
         httpStatus.BAD_REQUEST,
         "Status must be either 'active' or 'ban'."
      );
   }

   const isUserExist = await prisma.user.findUnique({
      where: {
         id: userId,
      },
   });

   if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
   }

   if (isUserExist.status === requiredUserStatus) {
      throw new AppError(
         httpStatus.BAD_REQUEST,
         `User is already in ${requiredUserStatus} this status.`
      );
   }

   const result = await prisma.user.update({
      where: {
         id: userId,
      },
      data: {
         status: requiredUserStatus,
      },
      omit: {
         password: true,
      },
   });

   return result;
};

const getAllProperties = async () => {
   const allProperties = await prisma.property.findMany({
      include: {
         landlord: {
            select: {
               id: true,
               email: true,
            },
         },
      },
   });

   const totalCount = await prisma.property.count({});

   return { data: allProperties, totalCount };
};

const getAllRentalRequest = async () => {
   const rentalRequests = await prisma.rentalRequest.findMany({
      include: {
         tenant: {
            select: {
               id: true,
               email: true,
               name: true,
            },
         },
      },
   });

   return rentalRequests;
};

export const adminServices = {
   createCategory,
   getAllUsers,
   updateUserStatus,
   getAllProperties,
   getAllRentalRequest,
};
