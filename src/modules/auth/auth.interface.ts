import { UserRole } from '../../../generated/prisma/enums.js';

export interface ILoginUser {
   email: string;
   password: string;
}

export interface IJwtPayload {
   id: string;
   email: string;
   role: UserRole;
}
