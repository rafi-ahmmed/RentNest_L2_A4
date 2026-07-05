import chalk from 'chalk';
import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

const PORT = config.port;

async function main() {
   try {
      await prisma.$connect();
      console.log(chalk.blueBright('Prisma postgres is connected!'));
      app.listen(PORT, () => {
         console.log(chalk.greenBright(`Server is running on port ${PORT}`));
      });
   } catch (error) {
      console.log(chalk.red('Error starting the server', error));
      await prisma.$disconnect();
      process.exit(1);
   }
}

main();
