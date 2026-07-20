import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';

const sql = neon('postgresql://neondb_owner:npg_g3lK4zwZOHPC@ep-nameless-mud-auaae0k9-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require');
const db = drizzle(sql);

async function main() {
  const email = 'admin@techstore.com';
  const password = 'admin123';
  const passwordHash = await bcryptjs.hash(password, 10);

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    console.log('Admin already exists!');
    return;
  }

  await db.insert(users).values({
    name: 'Administrador Principal',
    email,
    passwordHash,
    role: 'ADMINISTRADOR'
  });

  console.log('Admin user created successfully: admin@techstore.com / admin123');
}

main().catch(console.error);
