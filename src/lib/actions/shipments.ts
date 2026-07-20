"use server";

import { db } from '@/lib/db';
import { shipments, sales, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { revalidatePath } from 'next/cache';

export type ShipmentWithSale = {
  id: number;
  saleId: number;
  trackingNumber: string | null;
  carrier: string | null;
  status: string;
  address: any;
  updatedAt: Date | null;
  userEmail: string | null;
  userName: string | null;
  saleTotal: string;
};

export async function getShipments(): Promise<ShipmentWithSale[]> {
  const rows = await db
    .select({
      id: shipments.id,
      saleId: shipments.saleId,
      trackingNumber: shipments.trackingNumber,
      carrier: shipments.carrier,
      status: shipments.status,
      address: shipments.address,
      updatedAt: shipments.updatedAt,
      userEmail: users.email,
      userName: users.name,
      saleTotal: sales.total,
    })
    .from(shipments)
    .innerJoin(sales, eq(shipments.saleId, sales.id))
    .leftJoin(users, eq(sales.userId, users.id))
    .orderBy(shipments.updatedAt);

  return rows as ShipmentWithSale[];
}

/**
 * Updates a shipment's status in Neon DB.
 * When status changes to DESPACHADO, automatically fires a WhatsApp notification.
 */
export async function updateShipmentStatus(
  shipmentId: number,
  newStatus: 'PREPARACION' | 'DESPACHADO' | 'EN_TRANSITO' | 'ENTREGADO',
  trackingNumber?: string,
  carrier?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Get existing shipment + user data before update
    const rows = await db
      .select({
        saleId: shipments.saleId,
        userName: users.name,
        userEmail: users.email,
      })
      .from(shipments)
      .innerJoin(sales, eq(shipments.saleId, sales.id))
      .leftJoin(users, eq(sales.userId, users.id))
      .where(eq(shipments.id, shipmentId))
      .limit(1);

    if (!rows.length) return { success: false, error: 'Envío no encontrado.' };

    const { saleId, userName, userEmail } = rows[0];

    // 2. Update status in Neon
    await db.update(shipments)
      .set({
        status: newStatus,
        trackingNumber: trackingNumber ?? undefined,
        carrier: carrier ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(shipments.id, shipmentId));

    // 3. Fire WhatsApp when status → DESPACHADO
    if (newStatus === 'DESPACHADO') {
      const tracking = trackingNumber ? `\n📦 Número de guía: *${trackingNumber}*` : '';
      const carrierText = carrier ? ` (${carrier})` : '';

      await sendWhatsAppNotification(
        // Production: fetch phone from user record
        '+525555555555',
        `🚚 ¡Hola ${userName ?? 'cliente'}! Tu pedido de la Orden #${saleId} fue *despachado*${carrierText}.${tracking}\n\n` +
        `Puedes rastrear tu paquete en la página de la paquetería. Si tienes dudas, contáctanos.`
      );
    }

    revalidatePath('/shipments');
    return { success: true };
  } catch (error) {
    console.error('updateShipmentStatus error:', error);
    return { success: false, error: 'Error al actualizar el envío.' };
  }
}
