"use server";

import { db } from '@/lib/db';
import { products, inventory, hardwareCompatibility } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ─────────────────────────────────────────────────────────────
// PRODUCTS CRUD
// ─────────────────────────────────────────────────────────────

export type CreateProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId?: number;
  specs: Record<string, any>; // JSONB — variable tech attributes
  images: string[];
  initialStock: number;
};

export async function createProduct(input: CreateProductInput) {
  const [newProduct] = await db
    .insert(products)
    .values({
      name: input.name,
      slug: input.slug,
      description: input.description,
      price: input.price.toFixed(2),
      categoryId: input.categoryId ?? null,
      specs: input.specs,
      images: input.images,
    })
    .returning({ id: products.id });

  // Create inventory record simultaneously
  await db.insert(inventory).values({
    productId: newProduct.id,
    stockQuantity: input.initialStock,
    reservedQuantity: 0,
  });

  revalidatePath('/dashboard/catalog');
  revalidatePath('/catalog');
  revalidatePath('/pos');

  return { success: true, productId: newProduct.id };
}

export async function updateProduct(
  id: number,
  input: Partial<CreateProductInput>
) {
  await db.update(products).set({
    name: input.name,
    description: input.description,
    price: input.price !== undefined ? input.price.toFixed(2) : undefined,
    specs: input.specs,
    images: input.images,
  }).where(eq(products.id, id));

  if (input.initialStock !== undefined) {
    await db.update(inventory)
      .set({ stockQuantity: input.initialStock })
      .where(eq(inventory.productId, id));
  }

  revalidatePath('/dashboard/catalog');
  revalidatePath('/catalog');
  return { success: true };
}

export async function deleteProduct(id: number) {
  // inventory is deleted by cascade in DB via the FK constraint
  await db.delete(products).where(eq(products.id, id));
  revalidatePath('/dashboard/catalog');
  revalidatePath('/catalog');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// HARDWARE COMPATIBILITY RULES CRUD
// ─────────────────────────────────────────────────────────────

export async function createCompatibilityRule(
  componentTypeA: string,
  componentTypeB: string,
  rule: Record<string, any>
) {
  await db.insert(hardwareCompatibility).values({
    componentTypeA,
    componentTypeB,
    compatibilityRule: rule,
  });
  revalidatePath('/dashboard/builder-rules');
  revalidatePath('/pc-builder');
  return { success: true };
}

export async function deleteCompatibilityRule(id: number) {
  await db.delete(hardwareCompatibility).where(eq(hardwareCompatibility.id, id));
  revalidatePath('/dashboard/builder-rules');
  return { success: true };
}
