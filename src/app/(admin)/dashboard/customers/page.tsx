import CustomersAdmin from '@/components/admin/customers-admin';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const metadata = { title: 'Gestión de Clientes - Admin' };

export const revalidate = 0; // Ensure fresh data

export default async function CustomersAdminPage() {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.role, 'CLIENTE'))
    .orderBy(users.id);

  const customerList = rows.map(r => ({
    ...r,
    createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString()
  }));

  return <CustomersAdmin customers={customerList} />;
}
