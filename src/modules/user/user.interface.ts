import { UserRole } from '../../../generated/prisma/enums.js';

export interface IRegisterUserPayload {
   name?: string;
   email: string;
   password: string;
   image?: string;
   role?: UserRole;
}
