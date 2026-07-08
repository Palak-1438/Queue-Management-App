import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'Missing DATABASE_URL environment variable. ' +
    'Please ensure DATABASE_URL is configured in your environment variables. ' +
    'For Neon: Get it from https://console.neon.tech and set it in your Vercel project settings.'
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
