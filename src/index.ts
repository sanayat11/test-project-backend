import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './config/db';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('⚡ Connected to Database via Prisma');

    const port = Number(process.env.PORT) || 5000;
    const host = '0.0.0.0';

    app.listen(port, host, () => {
      console.log(`🚀 Creator Analytics Backend running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend server:', error);
    process.exit(1);
  }
}

bootstrap();
