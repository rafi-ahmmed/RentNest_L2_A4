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

const getRentalRequest = async () => {};

const requestAction = async () => {};

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
   requestAction,
   getAllProperties,
   getPropertyById,
   getAllCategories,
};
