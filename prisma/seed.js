const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const email = process.env.ADMIN_EMAIL || 'admin@queueflow.com';
const password = process.env.ADMIN_PASSWORD || 'Password123!';
const name = process.env.ADMIN_NAME || 'Admin Manager';

(async () => {
  if (isVercel) {
    console.log('Running manager seed on Vercel environment.');
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      console.log(`User already exists: ${existing.email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    console.log('Created user:', user.email);
    console.log('Use this password to login:', password);
    if (isVercel) {
      console.log('Vercel deployment should now be able to sign in with these credentials.');
    }
  } catch (error) {
    console.error('Failed to seed user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
})();
