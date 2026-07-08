import { RentalReqStatus } from '../../../generated/prisma/enums.js';
import { PropertyWhereInput } from '../../../generated/prisma/models.js';

import AppError from '../../errors/appError.js';
import { prisma } from '../../lib/prisma.js';
import {
   ICreatePropertyPayload,
   IPropertyQuery,
   IUpdatePropertyPayload,
} from './property.interface.js';
import httpStatus from 'http-status';

const createProperty = async (
   payload: ICreatePropertyPayload,
   landlordId: string
) => {
   // console.log(payload,landlordId);

   const result = await prisma.property.create({
      data: {
         ...payload,
         landlordId,
      },
      include: {
         category: {
            select: {
               name: true,
            },
         },
      },
   });

   return result;
};

const updateProperty = async (
   payload: IUpdatePropertyPayload,
   propertyId: string,
   isLandlord: boolean,
   landlordId: string
) => {
   const existProperty = await prisma.property.findUnique({
      where: {
         id: propertyId,
      },
   });

   // console.log(existProperty);
   if (!existProperty) {
      throw new AppError(httpStatus.NOT_FOUND, 'Property not found');
   }

   if (!isLandlord && existProperty.landlordId !== landlordId) {
      throw new AppError(
         httpStatus.FORBIDDEN,
         'You are not the owner this Property!'
      );
   }

   const result = await prisma.property.update({
      where: { id: propertyId },
      data: {
         ...payload,
      },
      include: {
         category: {
            select: {
               name: true,
            },
         },
      },
   });

   return result;
};

const deleteProperty = async (
   propertyId: string,
   isLandlord: boolean,
   landlordId: string
) => {
   const existProperty = await prisma.property.findUnique({
      where: {
         id: propertyId,
      },
   });

   // console.log(existProperty);
   if (!existProperty) {
      throw new AppError(
         httpStatus.NOT_FOUND,
         'Property not found which u want to deleted'
      );
   }

   if (!isLandlord && existProperty.landlordId !== landlordId) {
      throw new AppError(
         httpStatus.FORBIDDEN,
         'You are not the owner this Property!'
      );
   }

   const result = await prisma.property.delete({
      where: {
         id: propertyId,
      },
   });

   return result;
};

const getRentalRequest = async (landlordId: string) => {
   const rentRequests = await prisma.property.findMany({
      where: {
         landlordId,
      },
      select: {
         id: true,
         title: true,
         iaAvailable: true,
         landlord: {
            select: {
               id: true,
               email: true,
            },
         },

         category: {
            select: {
               name: true,
            },
         },
         rentalRequests: {
            select: {
               id: true,
               status: true,
               tenant: {
                  select: {
                     id: true,
                     email: true,
                  },
               },
            },
            orderBy: {
               createdAt: 'asc',
            },
         },
      },
   });

   if (!rentRequests) {
      throw new AppError(httpStatus.NOT_FOUND, 'No rental request found');
   }

   return rentRequests;
};

const updateReqStatus = async (
   payload: { status: string },
   landlordId: string,
   requestId: string
) => {
   const { status } = payload;

   let requiredStatus;

   if (status === 'approved') {
      requiredStatus = RentalReqStatus.APPROVED;
   } else if (status === 'rejected') {
      requiredStatus = RentalReqStatus.REJECTED;
   } else if (status === 'completed') {
      requiredStatus = RentalReqStatus.COMPLETED;
   } else {
      throw new AppError(
         httpStatus.BAD_REQUEST,
         'Invalid rental request status.'
      );
   }

   const request = await prisma.rentalRequest.findUnique({
      where: {
         id: requestId,
      },
      include: {
         properties: true,
      },
   });

   // console.log(request);

   if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, 'No request found.');
   }

   if (request.properties.landlordId !== landlordId) {
      throw new AppError(
         httpStatus.UNAUTHORIZED,
         'You are not authorized to update this rental request.'
      );
   }

   if (
      request.status === RentalReqStatus.PENDING &&
      requiredStatus === RentalReqStatus.COMPLETED
   ) {
      throw new AppError(
         httpStatus.BAD_REQUEST,
         'You are not change a Pending request as Completed request.'
      );
   }

   if (
      request.status === RentalReqStatus.REJECTED &&
      requiredStatus === RentalReqStatus.COMPLETED
   ) {
      throw new AppError(
         httpStatus.BAD_REQUEST,
         'You are not change a Rejected request as Completed request.'
      );
   }
   if (
      request.status === RentalReqStatus.ACTIVE &&
      requiredStatus === RentalReqStatus.APPROVED
   ) {
      throw new AppError(
         httpStatus.BAD_REQUEST,
         'You are not change a Active request as Approved request.'
      );
   }
   if (
      request.status === RentalReqStatus.REJECTED &&
      requiredStatus === RentalReqStatus.APPROVED
   ) {
      throw new AppError(
         httpStatus.BAD_REQUEST,
         'You are not change a rejected request as Approved request.'
      );
   }

   if (request.status === requiredStatus) {
      throw new AppError(
         httpStatus.BAD_REQUEST,
         `This rental request status already in ${requiredStatus}.`
      );
   }

   const result = await prisma.$transaction(async (tx) => {
      const updateResult = await tx.rentalRequest.update({
         where: {
            id: requestId,
         },
         data: {
            status: requiredStatus,
         },
      });

      if (requiredStatus === RentalReqStatus.COMPLETED) {
         await tx.property.update({
            where: { id: request.properties.id },
            data: {
               iaAvailable: true,
            },
         });
      }

      return updateResult;
   });

   return result;
};

const getAllProperties = async (filterOptions: IPropertyQuery) => {
   const { location, minPrice, maxPrice, amenities, type } = filterOptions;
   const andCondition: PropertyWhereInput[] = [];

   if (location) {
      andCondition.push({
         location: {
            contains: location,
            mode: 'insensitive',
         },
      });
   }

   if (minPrice) {
      andCondition.push({
         rent: {
            gte: Number(minPrice),
         },
      });
   }

   if (maxPrice) {
      andCondition.push({
         rent: {
            lte: Number(maxPrice),
         },
      });
   }

   if (amenities) {
      const amenitiesArray = amenities
         .split(',')
         .map((item) => item.toLowerCase());

      andCondition.push({
         amenities: {
            hasSome: amenitiesArray,
         },
      });
   }

   if (type) {
      andCondition.push({
         category: {
            name: type,
         },
      });
   }

   const properties = await prisma.property.findMany({
      omit: {
         createdAt: true,
         updatedAt: true,
         categoryId: true,
         landlordId: true,
      },
      include: {
         category: {
            select: {
               name: true,
            },
         },
         landlord: {
            select: {
               email: true,
            },
         },
         reviews: {
            select: {
               rating: true,
               comment: true,
            },
         },
      },

      where: {
         AND: andCondition,
      },

      orderBy: {
         createdAt: 'desc',
      },
   });

   const totalCount = await prisma.property.count({
      where: {
         AND: andCondition,
      },
   });

   return {
      total: totalCount,
      data: properties,
   };
};

const getPropertyById = async (propertyId: string) => {
   const property = await prisma.property.findUnique({
      where: {
         id: propertyId,
      },
      omit: {
         createdAt: true,
         updatedAt: true,
         categoryId: true,
         landlordId: true,
      },
      include: {
         category: {
            select: {
               name: true,
            },
         },
      },
   });

   if (!property) {
      throw new AppError(httpStatus.NOT_FOUND, 'Property not found!');
   }

   return property;
};

const getAllCategories = async () => {
   const result = await prisma.category.findMany({
      // include: {
      //    properties: true,
      // },
      omit: {
         createdAt: true,
      },
   });
   return result;
};

export const propertyServices = {
   createProperty,
   updateProperty,
   deleteProperty,
   getRentalRequest,
   updateReqStatus,
   getAllProperties,
   getPropertyById,
   getAllCategories,
};
