import { RentalReqStatus } from '../../../generated/prisma/enums.js';
import AppError from '../../errors/appError.js';
import { prisma } from '../../lib/prisma.js';
import { IReview } from './review.interface.js';
import HttpStatus from 'http-status';

const postReview = async (payload: IReview, userId: string) => {
   const rental = await prisma.rentalRequest.findFirst({
      where: {
         tenantId: userId,
         propertyId: payload.propertyId,
         status: RentalReqStatus.COMPLETED,
      },
   });

   if (!rental) {
      throw new AppError(
         HttpStatus.BAD_REQUEST,
         'You can only review a property after completing the rental.'
      );
   }

   if (payload.rating < 1 || payload.rating > 5) {
      throw new AppError(
         HttpStatus.BAD_REQUEST,
         'Rating must be between 1 and 5.'
      );
   }
   const existingReview = await prisma.review.findFirst({
      where: {
         tenantId: userId,
         propertyId: payload.propertyId,
      },
   });

   if (existingReview) {
      throw new AppError(
         HttpStatus.CONFLICT,
         'You have already reviewed this property.'
      );
   }

   const result = await prisma.review.create({
      data: {
         ...payload,
         tenantId: userId,
      },
   });

   return result;
};

export const reviewServices = {
   postReview,
};
