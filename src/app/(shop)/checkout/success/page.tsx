import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-8">
      <div className="h-28 w-28 rounded-full bg-green-500/10 flex items-center justify-center animate-bounce">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">¡Pago exitoso!</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Tu orden fue recibida y está siendo procesada. Recibirás una confirmación por WhatsApp en breve.
        </p>
      </div>
      <div className="flex gap-4">
        <a href="/profile" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30">
          Ver Mis Órdenes
        </a>
        <a href="/catalog" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95">
          Seguir Comprando
        </a>
      </div>
    </div>
  );
}
