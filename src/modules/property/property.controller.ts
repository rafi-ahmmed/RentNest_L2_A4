import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import httpStatus from 'http-status';
import { propertyServices } from './property.service.js';
import { UserRole } from '../../../generated/prisma/enums.js';

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

const getRentalRequests = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const landlordId = req.user?.id as string;
      // console.log(user);

      const result = await propertyServices.getRentalRequest(landlordId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message:
            result.length === 0
               ? 'No rental requests found'
               : 'Rental requests retrieved successfully.',
         data: result,
      });
   }
);

const updateReqStatus = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      const landlordId = req.user?.id as string;
      const requestId = req.params.id as string;

      const result = await propertyServices.updateReqStatus(
         payload,
         landlordId,
         requestId
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: `Request status updated as ${payload.status}`,
         data: result,
      });
   }
);

const getAllProperties = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const filterOptions = req.query;

      const result = await propertyServices.getAllProperties(filterOptions);

      sendResponse(res, {
         success: !result.data.length ? false : true,
         statusCode: !result.data.length ? httpStatus.NOT_FOUND : httpStatus.OK,
         message: !result.data.length
            ? 'No Properties Found'
            : 'Properties retrieved successfully.',
         meta: {
            total: result.total,
         },
         data: result.data,
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
   getRentalRequests,
   updateReqStatus,
   getAllProperties,
   getPropertyById,
   getAllCategories,
};
