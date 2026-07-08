import AppError from '../../errors/appError.js';
import { prisma } from '../../lib/prisma.js';
import { ICreateRentalRequestPayload } from './rentalRequest.interface.js';
import HttpStatus from 'http-status';

const createRentalReq = async (
   payload: ICreateRentalRequestPayload,
   tenantId: string
) => {
   const { message, moveInDate, propertyId } = payload;

   const property = await prisma.property.findUnique({
      where: { id: propertyId },
   });

   if (!property) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Property not found');
   }

   if (property.iaAvailable === false) {
      throw new AppError(
         HttpStatus.BAD_REQUEST,
         'This property is no longer available for rent.'
      );
   }

   if (!moveInDate) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Move in date is required');
   }

   const moveInDate2 = new Date(payload.moveInDate);
   // console.log(moveInDate2);
   const dateToday = new Date();

   if (moveInDate2 < dateToday) {
      throw new AppError(
         HttpStatus.BAD_REQUEST,
         'Move-in date cannot be in the past'
      );
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
      orderBy: {
         updatedAt: 'desc',
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

   const total = await prisma.rentalRequest.count({
      where: { tenantId },
   });

   if (!allRequests) {
      throw new AppError(HttpStatus.NOT_FOUND, 'No request found');
   }

   return { data: allRequests, total };
};

const getRentalReqById = async (reqId: string, tenantId: string) => {
   if (!reqId) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Rental request id required');
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
      throw new AppError(HttpStatus.NOT_FOUND, 'No request found');
   }

   if (rentalRequest.tenantId !== tenantId) {
      throw new AppError(
         HttpStatus.FORBIDDEN,
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
