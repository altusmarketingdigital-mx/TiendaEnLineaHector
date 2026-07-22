"use server";

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { reserveStock, releaseStock, type ReserveItem } from '@/lib/actions/inventory';
import { auth } from '@/auth';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN ?? 'APP_USR-mock-token',
});

const preference = new Preference(client);

export type CheckoutItem = {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
};

type CheckoutResult =
  | { success: true; checkoutUrl: string }
  | { success: false; error: string };

/**
 * Server Action: Creates a Mercado Pago Preference (Checkout Pro).
 * Flow:
 *   1. Reserve stock (increment reserved_quantity)
 *   2. Build MP Preference with line items
 *   3. Return the hosted checkout URL (init_point)
 *   4. If MP fails → release the reservation
 */
export async function createCheckoutSession(items: CheckoutItem[]): Promise<CheckoutResult> {
  const session = await auth();
  const userId = session?.user ? Number((session.user as { id?: string }).id) : null;

  // 1. Reserve stock to block concurrent POS/web purchases
  const reserveItems: ReserveItem[] = items.map(i => ({
    productId: i.productId,
    quantity: i.quantity,
  }));

  const reserveResult = await reserveStock(reserveItems);
  if (!reserveResult.success) {
    return { success: false, error: reserveResult.error };
  }

  // 2. Create MP Preference
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  try {
    const response = await preference.create({
      body: {
        items: items.map(item => ({
          id: String(item.productId),
          title: item.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          currency_id: 'MXN',
        })),
        // Pass userId in external_reference so the webhook can link the payment to a user
        external_reference: userId ? String(userId) : 'guest',
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        // Automatic return after successful payment
        auto_return: 'approved',
        // Our webhook endpoint — MP will call this when payment status changes
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
        statement_descriptor: 'TECH.STORE',
      }
    });

    const checkoutUrl = response.init_point;

    if (!checkoutUrl) {
      await releaseStock(reserveItems);
      return { success: false, error: 'No se pudo obtener la URL de pago de Mercado Pago.' };
    }

    return { success: true, checkoutUrl };
  } catch (err: unknown) {
    // If MP fails for any reason, release the reservation immediately
    await releaseStock(reserveItems);

    // In development without a real MP token, return a mock URL
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ MP Token de prueba — simulando checkout URL');
      return { success: true, checkoutUrl: `${baseUrl}/checkout/success?mock=1` };
    }

    console.error('Mercado Pago error:', err);
    return { success: false, error: 'Error al conectar con Mercado Pago. Intenta de nuevo.' };
  }
}
