import { RentalReqStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import {
   ICreatePropertyPayload,
   IUpdatePropertyPayload,
} from './property.interface';

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

   console.log(existProperty);
   if (!existProperty) {
      throw new Error('Property not found');
   }

   if (!isLandlord && existProperty.landlordId !== landlordId) {
      throw new Error('You are not the owner this Property!');
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

   console.log(existProperty);
   if (!existProperty) {
      throw new Error('Property not found which u want to deleted');
   }

   if (!isLandlord && existProperty.landlordId !== landlordId) {
      throw new Error('You are not the owner this Property!');
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
         },
      },
   });

   if (!rentRequests) {
      throw new Error('No rental request found');
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
   } else {
      throw new Error('Invalid rental request status.');
   }

   const request = await prisma.rentalRequest.findUnique({
      where: {
         id: requestId,
      },
      include: {
         properties: true,
      },
   });

   if (!request) {
      throw new Error('No request found.');
   }

   if (request.properties.landlordId !== landlordId) {
      throw new Error('You are not authorized to update this rental request.');
   }

   if (request.status !== RentalReqStatus.PENDING) {
      throw new Error('This rental request has already been processed.');
   }

   const result = await prisma.rentalRequest.update({
      where: {
         id: requestId,
      },
      data: {
         status: requiredStatus,
      },
   });

   return result;
};

const getAllProperties = async () => {
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
      },
   });
   return properties;
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
      throw new Error('Property not found!');
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
