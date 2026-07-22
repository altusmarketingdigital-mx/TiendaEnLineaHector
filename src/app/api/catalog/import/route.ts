import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, inventory } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

type CsvRow = {
  name: string;
  slug: string;
  price: string;
  categoryName: string;
  stockQuantity: string;
  description: string;
  images: string;
};

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  return lines.slice(1).map(line => {
    // Handle quoted fields that may contain commas
    const fields: string[] = [];
    let inQuotes = false;
    let current = '';
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = fields[i] ?? ''; });
    return row as unknown as CsvRow;
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCsv(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'El archivo CSV está vacío o tiene un formato inválido.' }, { status: 400 });
    }

    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        const { name, slug, price, categoryName, stockQuantity, description, images } = row;

        if (!name || !slug || !price) {
          errors.push(`Fila omitida (falta name, slug o price): ${JSON.stringify(row)}`);
          continue;
        }

        // Upsert category
        let categoryId: number | null = null;
        if (categoryName) {
          const catSlug = categoryName.toLowerCase().replace(/\s+/g, '-');
          let [cat] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, catSlug));
          if (!cat) {
            const [newCat] = await db.insert(categories).values({ name: categoryName, slug: catSlug }).returning({ id: categories.id });
            cat = newCat;
          }
          categoryId = cat.id;
        }

        // Parse images (comma-separated URLs inside the field)
        const imageArray = images ? images.split('|').map(s => s.trim()).filter(Boolean) : [];

        // Upsert product (by slug)
        const [existingProduct] = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug));

        let productId: number;
        if (existingProduct) {
          await db.update(products).set({
            name,
            price,
            description: description || null,
            categoryId,
            images: imageArray.length > 0 ? imageArray : null,
          }).where(eq(products.id, existingProduct.id));
          productId = existingProduct.id;
          updated++;
        } else {
          const [newProduct] = await db.insert(products).values({
            name,
            slug,
            price,
            description: description || null,
            categoryId,
            images: imageArray.length > 0 ? imageArray : null,
          }).returning({ id: products.id });
          productId = newProduct.id;
          created++;
        }

        // Upsert inventory
        const qty = parseInt(stockQuantity || '0', 10);
        await db.insert(inventory)
          .values({ productId, stockQuantity: qty, reservedQuantity: 0 })
          .onConflictDoUpdate({
            target: inventory.productId,
            set: { stockQuantity: qty, updatedAt: sql`now()` },
          });

      } catch (rowErr) {
        errors.push(`Error en fila "${row.name ?? '?'}": ${rowErr instanceof Error ? rowErr.message : String(rowErr)}`);
      }
    }

    return NextResponse.json({
      message: `Importación completada. ${created} creados, ${updated} actualizados.`,
      created,
      updated,
      errors,
    });

  } catch (err) {
    console.error('[CSV Import Error]', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
