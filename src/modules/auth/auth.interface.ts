import { UserRole } from '../../../generated/prisma/enums';

export interface ILoginUser {
   email: string;
   password: string;
}

export interface IJwtPayload {
   id: string;
   email: string;
   role: UserRole;
}
