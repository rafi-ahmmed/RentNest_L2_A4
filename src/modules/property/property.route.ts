import { Router } from 'express';
import { propertyControllers } from './property.controller.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/prisma/enums.js';

const router = Router();

// For landlords
router.post(
   '/landlord/properties',
   auth(UserRole.LANDLORD),
   propertyControllers.createProperty
);
router.put(
   '/landlord/properties/:id',
   auth(UserRole.LANDLORD),
   propertyControllers.updateProperty
);
router.delete(
   '/landlord/properties/:id',
   auth(UserRole.LANDLORD),
   propertyControllers.deleteProperty
);

router.get(
   '/landlord/requests',
   auth(UserRole.LANDLORD),
   propertyControllers.getRentalRequests
);
router.patch(
   '/landlord/requests/:id',
   auth(UserRole.LANDLORD),
   propertyControllers.updateReqStatus
);

// For Public
router.get('/properties', propertyControllers.getAllProperties);
router.get('/properties/:id', propertyControllers.getPropertyById);
router.get('/categories', propertyControllers.getAllCategories);

export const propertyRoutes = router;
