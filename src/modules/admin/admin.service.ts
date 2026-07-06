import { prisma } from '../../lib/prisma';

const createCategory = async (payload: { name: string }) => {
   const name = payload.name;

   if (!name) {
      throw new Error('Category name is required');
   }
   const result = await prisma.category.create({
      data: {
         name: name,
      },
   });

   return result;
};

export const adminServices = {
   createCategory,
};
