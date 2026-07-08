import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
import config from './src/config/index.js';

export default defineConfig({
   schema: 'prisma/schema',
   migrations: {
      path: 'prisma/migrations',
   },
   datasource: {
      url: config.databaseUrl,
   },
});
