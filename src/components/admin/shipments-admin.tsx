"use client";

import React, { useState, useTransition } from 'react';
import { Truck, CheckCircle2, AlertCircle, Package, MessageCircle, Loader2 } from 'lucide-react';
import { updateShipmentStatus, type ShipmentWithSale } from '@/lib/actions/shipments';

type Props = { shipments: ShipmentWithSale[] };

const STATUS_ORDER = ['PREPARACION', 'DESPACHADO', 'EN_TRANSITO', 'ENTREGADO'] as const;
type ShipmentStatus = typeof STATUS_ORDER[number];

const statusConfig: Record<ShipmentStatus, { label: string; color: string; next?: ShipmentStatus }> = {
  PREPARACION: { label: 'En Preparación', color: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30', next: 'DESPACHADO' },
  DESPACHADO: { label: 'Despachado', color: 'bg-blue-500/15 text-blue-500 border-blue-500/30', next: 'EN_TRANSITO' },
  EN_TRANSITO: { label: 'En Tránsito', color: 'bg-purple-500/15 text-purple-500 border-purple-500/30', next: 'ENTREGADO' },
  ENTREGADO: { label: 'Entregado', color: 'bg-green-500/15 text-green-500 border-green-500/30', next: undefined },
};

export default function ShipmentsAdmin({ shipments: initialShipments }: Props) {
  const [shipments, setShipments] = useState(initialShipments);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<number, { number: string; carrier: string }>>({});

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const handleAdvance = (shipment: ShipmentWithSale) => {
    const config = statusConfig[shipment.status as ShipmentStatus];
    if (!config?.next) return;

    const nextStatus = config.next;
    const tracking = trackingInputs[shipment.id];

    startTransition(async () => {
      const result = await updateShipmentStatus(
        shipment.id,
        nextStatus,
        tracking?.number,
        tracking?.carrier,
      );

      if (result.success) {
        setShipments(prev => prev.map(s =>
          s.id === shipment.id ? { ...s, status: nextStatus, trackingNumber: tracking?.number ?? s.trackingNumber } : s
        ));

        if (nextStatus === 'DESPACHADO') {
          showToast('success', `🚚 Envío #${shipment.id} despachado. ¡WhatsApp enviado al cliente ${shipment.userName ?? shipment.userEmail ?? ''}!`);
        } else {
          showToast('success', `✅ Estado actualizado a "${statusConfig[nextStatus].label}"`);
        }
      } else {
        showToast('error', result.error ?? 'Error al actualizar.');
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold max-w-sm
          ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-destructive text-destructive-foreground'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Truck className="h-8 w-8 text-primary" /> Control de Envíos
          </h2>
          <p className="text-muted-foreground mt-1">
            Al avanzar a <strong>Despachado</strong>, el cliente recibe una notificación automática por{' '}
            <span className="text-green-500 font-bold">WhatsApp</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-full">
          <MessageCircle className="h-4 w-4" />
          WhatsApp API Activo
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {shipments.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-3xl text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-bold">Sin envíos pendientes</p>
          </div>
        ) : shipments.map(shipment => {
          const config = statusConfig[shipment.status as ShipmentStatus];
          const tracking = trackingInputs[shipment.id] ?? { number: '', carrier: '' };
          const canAdvance = !!config?.next;
          const address = shipment.address as any;

          return (
            <div key={shipment.id} className="bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                <div className="flex items-start gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                    <Package className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="font-black text-lg">Envío #{shipment.id}</p>
                      <span className="text-sm font-semibold text-muted-foreground">→ Orden #{shipment.saleId}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cliente: <strong className="text-foreground">{shipment.userName ?? shipment.userEmail ?? 'Cliente Mostrador'}</strong>
                    </p>
                    {shipment.trackingNumber && (
                      <p className="text-sm mt-1 font-mono text-primary">
                        📦 Guía: {shipment.trackingNumber} {shipment.carrier ? `(${shipment.carrier})` : ''}
                      </p>
                    )}
                    {address?.street && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {address.street}, {address.city}, {address.state}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                  <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border ${config?.color ?? ''}`}>
                    {config?.label ?? shipment.status}
                  </span>

                  {/* Tracking inputs before dispatching */}
                  {shipment.status === 'PREPARACION' && (
                    <div className="flex gap-3 w-full md:w-auto">
                      <input
                        placeholder="Número de guía"
                        value={tracking.number}
                        onChange={e => setTrackingInputs(p => ({ ...p, [shipment.id]: { ...tracking, number: e.target.value } }))}
                        className="px-3 py-2 text-sm bg-background border rounded-xl focus:ring-2 focus:ring-primary outline-none w-36 font-mono"
                      />
                      <input
                        placeholder="Paquetería"
                        value={tracking.carrier}
                        onChange={e => setTrackingInputs(p => ({ ...p, [shipment.id]: { ...tracking, carrier: e.target.value } }))}
                        className="px-3 py-2 text-sm bg-background border rounded-xl focus:ring-2 focus:ring-primary outline-none w-28"
                      />
                    </div>
                  )}

                  {canAdvance && (
                    <button
                      onClick={() => handleAdvance(shipment)}
                      disabled={isPending}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-60 text-sm
                        ${config.next === 'DESPACHADO'
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30'}`}
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> :
                        config.next === 'DESPACHADO' ? <MessageCircle className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                      {isPending ? 'Actualizando...' : `Marcar como ${statusConfig[config.next!].label}`}
                      {config.next === 'DESPACHADO' && !isPending && (
                        <span className="text-xs font-normal opacity-80">+ WhatsApp</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
