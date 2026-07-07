import { prisma } from '../../lib/prisma';
import { ICreateRentalRequestPayload } from './rentalRequest.interface';

const createRentalReq = async (
   payload: ICreateRentalRequestPayload,
   tenantId: string
) => {
   const { message, moveInDate, propertyId } = payload;

   const property = await prisma.property.findUnique({
      where: { id: propertyId },
   });

   if (!property) {
      throw new Error('Property not found');
   }

   if (property.iaAvailable === false) {
      throw new Error('This property is no longer available for rent.');
   }

   if (!moveInDate) {
      throw new Error('Move in date is required');
   }

   const moveInDate2 = new Date(payload.moveInDate);
   console.log(moveInDate2);
   const dateToday = new Date();

   if (moveInDate2 < dateToday) {
      throw new Error('Move-in date cannot be in the past');
   }

   const result = await prisma.rentalRequest.create({
      data: {
         propertyId,
         tenantId,
         message,
         moveInDate: moveInDate2,
      },
   });

   return result;
};

const getAllRentalReq = async (tenantId: string) => {
   const allRequests = await prisma.rentalRequest.findMany({
      where: {
         tenantId,
      },
      include: {
         tenant: {
            select: {
               email: true,
            },
         },
         properties: {
            select: {
               landlord: {
                  select: {
                     email: true,
                  },
               },
            },
         },
      },
   });

   if (!allRequests) {
      throw new Error('No request found');
   }

   return allRequests;
};

const getRentalReqById = async (reqId: string, tenantId: string) => {
   if (!reqId) {
      throw new Error('Rental request id required');
   }
   const rentalRequest = await prisma.rentalRequest.findUnique({
      where: {
         id: reqId,
      },
      include: {
         tenant: {
            select: {
               email: true,
            },
         },
      },
   });

   if (!rentalRequest) {
      throw new Error('No request found');
   }

   if (rentalRequest.tenantId !== tenantId) {
      throw new Error(
         'Forbidden: You are not authorized to access this rental request'
      );
   }

   return rentalRequest;
};

export const rentalRequestServices = {
   createRentalReq,
   getAllRentalReq,
   getRentalReqById,
};
