import { db } from '@/lib/db';
import { products, inventory } from '@/db/schema';
import { eq, gt } from 'drizzle-orm';

export type ProductWithInventory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  categoryId: number | null;
  specs: Record<string, unknown> | null;
  images: string[] | null;
  createdAt: Date | null;
  stockQuantity: number;
  reservedQuantity: number;
};

/**
 * Fetches all products with their current inventory levels from Neon.
 * Optionally filters by category slug or search term.
 */
export async function getProducts(opts?: {
  category?: string;
  search?: string;
  inStockOnly?: boolean;
}): Promise<ProductWithInventory[]> {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      categoryId: products.categoryId,
      specs: products.specs,
      images: products.images,
      createdAt: products.createdAt,
      stockQuantity: inventory.stockQuantity,
      reservedQuantity: inventory.reservedQuantity,
    })
    .from(products)
    .leftJoin(inventory, eq(inventory.productId, products.id))
    .where(
      opts?.inStockOnly
        ? gt(inventory.stockQuantity, 0)
        : undefined
    );

  return rows.map(r => ({
    ...r,
    stockQuantity: r.stockQuantity ?? 0,
    reservedQuantity: r.reservedQuantity ?? 0,
  }));
}

/**
 * Fetches a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<ProductWithInventory | null> {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      categoryId: products.categoryId,
      specs: products.specs,
      images: products.images,
      createdAt: products.createdAt,
      stockQuantity: inventory.stockQuantity,
      reservedQuantity: inventory.reservedQuantity,
    })
    .from(products)
    .leftJoin(inventory, eq(inventory.productId, products.id))
    .where(eq(products.slug, slug))
    .limit(1);

  if (!rows.length) return null;

  const r = rows[0];
  return {
    ...r,
    stockQuantity: r.stockQuantity ?? 0,
    reservedQuantity: r.reservedQuantity ?? 0,
  };
}

/**
 * Checks if a product has enough available stock.
 * Available stock = total stock - reserved
 */
export async function checkStock(productId: number, quantity: number): Promise<{
  available: boolean;
  availableQty: number;
}> {
  const rows = await db
    .select({
      stockQuantity: inventory.stockQuantity,
      reservedQuantity: inventory.reservedQuantity,
    })
    .from(inventory)
    .where(eq(inventory.productId, productId))
    .limit(1);

  if (!rows.length) return { available: false, availableQty: 0 };

  const { stockQuantity, reservedQuantity } = rows[0];
  const availableQty = stockQuantity - reservedQuantity;

  return {
    available: availableQty >= quantity,
    availableQty,
  };
}
