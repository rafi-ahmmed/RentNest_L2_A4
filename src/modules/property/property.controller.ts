import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { propertyServices } from './property.service';
import { UserRole } from '../../../generated/prisma/enums';

const createProperty = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      const landlordId = req.user?.id!;

      const result = await propertyServices.createProperty(payload, landlordId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Property created successfully.',
         data: result,
      });
   }
);

const updateProperty = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      const propertyId = req.params.id as string;
      const isLandlord = req.user?.role === UserRole.LANDLORD;
      const landlordId = req.user?.id as string;

      const result = await propertyServices.updateProperty(
         payload,
         propertyId,
         isLandlord,
         landlordId
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Property Updated successfully.',
         data: result,
      });
   }
);

const deleteProperty = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const propertyId = req.params.id as string;
      const isLandlord = req.user?.role === UserRole.LANDLORD;
      const landlordId = req.user?.id as string;

      const result = await propertyServices.deleteProperty(
         propertyId,
         isLandlord,
         landlordId
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Property Deleted successfully.',
         data: result,
      });
   }
);

const getRentalRequest = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

const requestAction = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

const getAllProperties = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const result = await propertyServices.getAllProperties();

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Properties retrieved successfully.',
         data: result,
      });
   }
);

const getPropertyById = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const propertyId = req.params.id as string;

      const result = await propertyServices.getPropertyById(propertyId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Property retrieved successfully.',
         data: result,
      });
   }
);

const getAllCategories = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const result = await propertyServices.getAllCategories();

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Categories retrieved successfully.',
         data: result,
      });
   }
);

export const propertyControllers = {
   createProperty,
   updateProperty,
   deleteProperty,
   getRentalRequest,
   requestAction,
   getAllProperties,
   getPropertyById,
   getAllCategories,
};
