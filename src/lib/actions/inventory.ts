"use server";

import { db } from '@/lib/db';
import { inventory, sales, saleDetails } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { checkStock } from '@/lib/queries/products';
import { revalidatePath } from 'next/cache';

// ── Types ─────────────────────────────────────────────────────────────────────
export type ReserveItem = { productId: number; quantity: number };

type ReserveResult =
  | { success: true }
  | { success: false; error: string; productId?: number };

// ──────────────────────────────────────────────────────────────────────────────
/**
 * RESERVE: Increments reserved_quantity for each item.
 * Called at checkout START (before redirecting to Mercado Pago).
 * Prevents the POS from selling the same unit while the web user is paying.
 */
export async function reserveStock(items: ReserveItem[]): Promise<ReserveResult> {
  // Validate availability for all items first
  for (const item of items) {
    const { available, availableQty } = await checkStock(item.productId, item.quantity);
    if (!available) {
      return {
        success: false,
        error: `Sin stock suficiente para el producto ID ${item.productId}. Solo quedan ${availableQty} unidades disponibles.`,
        productId: item.productId,
      };
    }
  }

  // Atomically increment reserved_quantity in a transaction
  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(inventory)
        .set({
          reservedQuantity: sql`${inventory.reservedQuantity} + ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(inventory.productId, item.productId));
    }
  });

  revalidatePath('/catalog');
  revalidatePath('/pos');
  return { success: true };
}

// ──────────────────────────────────────────────────────────────────────────────
/**
 * RELEASE: Decrements reserved_quantity back.
 * Called when the user cancels payment, payment fails, or the session expires.
 */
export async function releaseStock(items: ReserveItem[]): Promise<void> {
  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(inventory)
        .set({
          reservedQuantity: sql`GREATEST(0, ${inventory.reservedQuantity} - ${item.quantity})`,
          updatedAt: new Date(),
        })
        .where(eq(inventory.productId, item.productId));
    }
  });

  revalidatePath('/catalog');
  revalidatePath('/pos');
}

// ──────────────────────────────────────────────────────────────────────────────
/**
 * CONFIRM: Called by the Mercado Pago webhook after a SUCCESSFUL payment.
 * Creates the sale record and DECREMENTS stock_quantity (not just reserved).
 * Then releases the reservation.
 */
export async function confirmStockAndCreateSale(
  userId: number,
  paymentMethod: string,
  items: Array<ReserveItem & { unitPrice: number }>
): Promise<{ saleId: number }> {
  const total = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  const saleId = await db.transaction(async (tx) => {
    // 1. Create sale record
    const [newSale] = await tx
      .insert(sales)
      .values({
        userId,
        origin: 'WEB',
        status: 'PAGADO',
        total: total.toFixed(2),
        paymentMethod,
      })
      .returning({ id: sales.id });

    // 2. Insert line items
    await tx.insert(saleDetails).values(
      items.map(i => ({
        saleId: newSale.id,
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice.toFixed(2),
      }))
    );

    // 3. Decrement both stock_quantity AND reserved_quantity atomically
    for (const item of items) {
      await tx
        .update(inventory)
        .set({
          stockQuantity: sql`${inventory.stockQuantity} - ${item.quantity}`,
          reservedQuantity: sql`GREATEST(0, ${inventory.reservedQuantity} - ${item.quantity})`,
          updatedAt: new Date(),
        })
        .where(eq(inventory.productId, item.productId));
    }

    return newSale.id;
  });

  revalidatePath('/catalog');
  revalidatePath('/pos');
  return { saleId };
}
