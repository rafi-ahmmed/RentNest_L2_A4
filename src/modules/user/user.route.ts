import { Router } from 'express';
import { userControllers } from './user.controller.js';

const router = Router();

router.post('/users/register', userControllers.registerUser);

export const userRoutes = router;
