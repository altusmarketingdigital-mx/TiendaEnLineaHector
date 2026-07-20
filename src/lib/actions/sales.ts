"use server";

import { db } from '@/lib/db';
import { sales, saleDetails, inventory } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { checkStock } from '@/lib/queries/products';
import { revalidatePath } from 'next/cache';

export type CartItem = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

export type CreateSaleInput = {
  userId?: number;      // null for POS walk-in customers
  employeeId?: number;  // null for web orders
  origin: 'WEB' | 'POS';
  paymentMethod: string;
  items: CartItem[];
};

type SaleResult =
  | { success: true; saleId: number }
  | { success: false; error: string };

/**
 * Server Action: Creates a complete sale (header + details)
 * and decrements inventory atomically using a DB transaction.
 * This prevents overselling when both WEB and POS run concurrently.
 */
export async function createSale(input: CreateSaleInput): Promise<SaleResult> {
  // 1. Pre-validate stock for ALL items before starting the transaction
  for (const item of input.items) {
    const { available, availableQty } = await checkStock(item.productId, item.quantity);
    if (!available) {
      return {
        success: false,
        error: `Stock insuficiente para el producto ID ${item.productId}. Disponibles: ${availableQty}.`,
      };
    }
  }

  try {
    const total = input.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );

    // 2. Run everything inside a single DB transaction for atomicity
    const result = await db.transaction(async (tx) => {
      // 2a. Create the sale header
      const [newSale] = await tx
        .insert(sales)
        .values({
          userId: input.userId ?? null,
          employeeId: input.employeeId ?? null,
          origin: input.origin,
          status: 'PENDIENTE',
          total: total.toFixed(2),
          paymentMethod: input.paymentMethod,
        })
        .returning({ id: sales.id });

      // 2b. Insert sale details (line items)
      await tx.insert(saleDetails).values(
        input.items.map((item) => ({
          saleId: newSale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toFixed(2),
        }))
      );

      // 2c. Decrement inventory for each item atomically
      for (const item of input.items) {
        await tx
          .update(inventory)
          .set({
            stockQuantity: sql`${inventory.stockQuantity} - ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(inventory.productId, item.productId));
      }

      return newSale.id;
    });

    // Revalidate pages that show inventory/stock after a successful sale
    revalidatePath('/catalog');
    revalidatePath('/pos');

    return { success: true, saleId: result };
  } catch (error) {
    console.error('Error creating sale:', error);
    return { success: false, error: 'Error interno al procesar la venta. Intenta de nuevo.' };
  }
}

/**
 * Server Action: Mark a sale as PAID (called after MP webhook confirms payment)
 */
export async function markSaleAsPaid(
  saleId: number,
  paymentMethod: string
): Promise<{ success: boolean }> {
  try {
    await db
      .update(sales)
      .set({ status: 'PAGADO', paymentMethod })
      .where(eq(sales.id, saleId));
    return { success: true };
  } catch {
    return { success: false };
  }
}
