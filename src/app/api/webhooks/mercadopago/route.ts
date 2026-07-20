import { NextResponse } from 'next/server';
import { payment } from '@/lib/mercadopago';
import { confirmStockAndCreateSale } from '@/lib/actions/inventory';
import { releaseStock } from '@/lib/actions/inventory';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') ?? url.searchParams.get('type');
    const id = url.searchParams.get('id') ?? url.searchParams.get('data.id');

    if (topic !== 'payment' || !id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 1. Fetch full payment info from MP (prevents spoofing)
    const paymentInfo = await payment.get({ id });
    const userId = paymentInfo.external_reference
      ? Number(paymentInfo.external_reference)
      : null;

    // Build items from metadata (MP stores them in additional_info)
    // In production, persist pending cart in DB/session before redirecting
    const mpItems = paymentInfo.additional_info?.items ?? [];
    const items = mpItems.map((i: any) => ({
      productId: Number(i.id),
      quantity: Number(i.quantity),
      unitPrice: Number(i.unit_price),
    }));

    if (paymentInfo.status === 'approved' && userId && items.length > 0) {
      // 2. Confirm: create sale record + decrement stock atomically
      const { saleId } = await confirmStockAndCreateSale(
        userId,
        paymentInfo.payment_method_id ?? 'mercadopago',
        items
      );

      // 3. WhatsApp: notify the customer
      if (userId) {
        const [user] = await db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        await sendWhatsAppNotification(
          '+525555555555', // Production: fetch user phone from DB
          `🚀 ¡Hola ${user?.name ?? 'cliente'}! Tu pago de $${paymentInfo.transaction_amount} MXN fue aprobado. ` +
          `Tu orden #${saleId} en TECH.STORE ya está en preparación.`
        );
      }
    } else if (paymentInfo.status === 'rejected' || paymentInfo.status === 'cancelled') {
      // 4. If payment failed → release the reservation
      if (items.length > 0) {
        await releaseStock(items);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook MP Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
