import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-8">
      <div className="h-28 w-28 rounded-full bg-destructive/10 flex items-center justify-center">
        <XCircle className="h-16 w-16 text-destructive" />
      </div>
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Pago no completado</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Tu pago fue rechazado o cancelado. Los artículos en tu carrito están disponibles de nuevo. Puedes intentarlo con otro método de pago.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/cart" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30">
          Volver al Carrito
        </Link>
        <Link href="/catalog" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95">
          Explorar Catálogo
        </Link>
      </div>
    </div>
  );
}
