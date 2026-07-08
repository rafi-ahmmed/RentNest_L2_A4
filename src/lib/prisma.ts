import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import config from '../config/index.js';
import { PrismaClient } from '../../generated/prisma/client.js';

const connectionString = config.databaseUrl;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
   adapter,
   // omit: {
   //    user: {
   //       password: true,
   //    },
   // },
});


export { prisma };
