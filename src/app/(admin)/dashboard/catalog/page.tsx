import CatalogAdmin from '@/components/admin/catalog-admin';
import { db } from '@/lib/db';
import { products, inventory } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const metadata = { title: 'Gestión de Catálogo - Admin' };

export default async function CatalogAdminPage() {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      specs: products.specs,
      stockQuantity: inventory.stockQuantity,
    })
    .from(products)
    .leftJoin(inventory, eq(inventory.productId, products.id));

  const productList = rows.map(r => ({ ...r, stockQuantity: r.stockQuantity ?? 0 }));

  return <CatalogAdmin products={productList} />;
}
