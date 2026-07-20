"use server";

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';

type RegisterResult = { success: true } | { success: false; error: string };

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<RegisterResult> {
  if (!name || !email || password.length < 8) {
    return { success: false, error: 'Datos inválidos. La contraseña debe tener al menos 8 caracteres.' };
  }

  // Check if email already exists
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { success: false, error: 'Este email ya está registrado.' };
  }

  const passwordHash = await bcryptjs.hash(password, 12);

  await db.insert(users).values({
    name,
    email,
    passwordHash,
    role: 'CLIENTE',
  });

  return { success: true };
}
