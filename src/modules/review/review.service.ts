import { RentalReqStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { IReview } from './review.interface';

const postReview = async (payload: IReview, userId: string) => {
   const rental = await prisma.rentalRequest.findFirst({
      where: {
         tenantId: userId,
         propertyId: payload.propertyId,
         status: RentalReqStatus.COMPLETED,
      },
   });

   if (!rental) {
      throw new Error(
         'You can only review a property after completing the rental.'
      );
   }

   if (payload.rating < 1 || payload.rating > 5) {
      throw new Error('Rating must be between 1 and 5.');
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
