import { db } from '@/lib/db';
import { sales, saleDetails, products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export type OrderHistoryItem = {
  saleId: number;
  createdAt: Date | null;
  status: 'PENDIENTE' | 'PAGADO' | 'CANCELADO';
  origin: 'WEB' | 'POS';
  total: string;
  paymentMethod: string | null;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: string;
  }>;
};

/**
 * Fetches the full order history for a given user from Neon DB.
 */
export async function getOrderHistory(userId: number): Promise<OrderHistoryItem[]> {
  // Fetch all sales for this user, newest first
  const userSales = await db
    .select({
      id: sales.id,
      createdAt: sales.createdAt,
      status: sales.status,
      origin: sales.origin,
      total: sales.total,
      paymentMethod: sales.paymentMethod,
    })
    .from(sales)
    .where(eq(sales.userId, userId))
    .orderBy(desc(sales.createdAt));

  if (!userSales.length) return [];

  // For each sale, fetch the line items with product names
  const results: OrderHistoryItem[] = await Promise.all(
    userSales.map(async (sale) => {
      const details = await db
        .select({
          productName: products.name,
          quantity: saleDetails.quantity,
          unitPrice: saleDetails.unitPrice,
        })
        .from(saleDetails)
        .innerJoin(products, eq(saleDetails.productId, products.id))
        .where(eq(saleDetails.saleId, sale.id));

      return {
        saleId: sale.id,
        createdAt: sale.createdAt,
        status: sale.status as OrderHistoryItem['status'],
        origin: sale.origin as OrderHistoryItem['origin'],
        total: sale.total,
        paymentMethod: sale.paymentMethod,
        items: details.map(d => ({
          productName: d.productName,
          quantity: d.quantity,
          unitPrice: d.unitPrice,
        })),
      };
    })
  );

  return results;
}
