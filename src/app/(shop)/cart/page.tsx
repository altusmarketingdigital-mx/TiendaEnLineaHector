"use client";

import React, { useState, useTransition } from 'react';
import { Trash2, ShieldCheck, CreditCard, Banknote, Loader2, AlertCircle, Cpu } from 'lucide-react';
import { createCheckoutSession, type CheckoutItem } from '@/lib/actions/checkout';
import Link from 'next/link';

type CartItemState = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

const defaultCart: CartItemState[] = [
  { productId: 1, name: 'NVIDIA RTX 4090 OC Edition 24GB GDDR6X', price: 1599.99, quantity: 1, category: 'GPU' },
  { productId: 2, name: 'Procesador Intel Core i9-14900K 24 Cores Socket LGA1700', price: 589.00, quantity: 1, category: 'CPU' },
];

export default function CartPage() {
  const [cart, setCart] = useState<CartItemState[]>(defaultCart);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev
      .map(i => i.productId === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const taxes = subtotal * 0.16;
  const total = subtotal + taxes;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setError('');
    startTransition(async () => {
      const items: CheckoutItem[] = cart.map(i => ({
        productId: i.productId,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.price,
      }));

      const result = await createCheckoutSession(items);

      if (result.success) {
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none"></div>

      <h1 className="text-3xl font-black text-white text-glow mb-8 flex items-center gap-3 relative z-10">
        <Cpu className="h-8 w-8 text-primary" /> MÓDULO DE PAGO
      </h1>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-red-950/50 text-red-400 border border-red-900/50 font-bold text-sm shadow-[0_0_15px_rgba(255,0,0,0.2)]">
          <AlertCircle className="h-5 w-5 shrink-0" /> {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Cart Items */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="bg-card/50 backdrop-blur-md border border-border shadow-2xl rounded-2xl text-center py-24 text-muted-foreground">
              <p className="text-2xl font-black text-white mb-4">MÓDULO VACÍO</p>
              <Link href="/catalog" className="inline-block px-8 py-3 bg-primary text-black rounded-lg font-black hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]">
                EXPLORAR SISTEMA
              </Link>
            </div>
          ) : (
            <div className="bg-card/80 backdrop-blur-md border border-border rounded-2xl flex flex-col shadow-2xl">
              {cart.map((item, i) => (
                <div key={item.productId} className={`p-6 flex flex-col md:flex-row gap-6 items-start md:items-center relative group overflow-hidden ${i !== cart.length - 1 ? 'border-b border-border/50' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="h-24 w-24 bg-background border border-primary/20 rounded-xl flex items-center justify-center font-black text-muted-foreground/30 text-xs uppercase shrink-0 shadow-inner relative">
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,240,255,0.05)] rounded-xl"></div>
                    {item.category ?? 'HW'}
                  </div>
                  
                  <div className="flex-1 flex flex-col md:flex-row justify-between w-full gap-6 relative z-10">
                    <div className="flex flex-col">
                      <Link href={`/catalog/${item.productId}`} className="font-bold text-white hover:text-primary transition-colors leading-tight max-w-md text-glow">
                        {item.name}
                      </Link>
                      <span className="text-xs text-muted-foreground mt-2 font-mono bg-background/50 w-fit px-2 py-1 rounded border border-border">UID: {item.productId}</span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-8 md:w-auto w-full justify-between md:justify-end">
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Valor</span>
                        <span className="font-black text-xl text-white">${item.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-primary/30 rounded-lg bg-background overflow-hidden shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                          <button onClick={() => updateQty(item.productId, -1)} className="px-4 py-2 hover:bg-primary/20 text-white font-black transition-colors">−</button>
                          <span className="font-black text-primary text-base w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.productId, 1)} className="px-4 py-2 hover:bg-primary/20 text-white font-black transition-colors">+</button>
                        </div>
                        <button
                          onClick={() => updateQty(item.productId, -item.quantity)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                          title="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex flex-col text-right w-28">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Subtotal</span>
                        <span className="font-black text-2xl text-primary text-glow">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary + Checkout */}
        <div className="lg:w-1/3">
          <div className="bg-card/80 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-6 sticky top-28 relative overflow-hidden">
            {/* Glowing accents */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
            
            <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest border-b border-border/50 pb-4 flex items-center justify-between">
              Resumen de Datos
              <div className="h-2 w-2 bg-primary rounded-full shadow-[0_0_10px_rgba(0,240,255,1)] animate-pulse"></div>
            </h2>

            <div className="flex flex-col gap-4 mb-8 text-sm font-medium">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Subtotal (sin IVA):</span>
                <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>IVA (16%):</span>
                <span className="text-white font-mono">${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-primary border-b border-border/50 pb-6">
                <span className="font-bold">Logística de Red:</span>
                <span className="font-black bg-primary/10 px-2 py-1 rounded border border-primary/20">ESTABLE (GRATIS)</span>
              </div>
              
              <div className="flex justify-between items-end pt-2">
                <span className="font-black text-muted-foreground uppercase tracking-wider text-xs">Total de Créditos:</span>
                <span className="text-4xl font-black text-white text-glow tracking-tighter">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Main CTA: Cyberpunk Checkout */}
            <button
              onClick={handleCheckout}
              disabled={isPending || cart.length === 0}
              className="w-full relative py-4 bg-transparent border border-primary/50 rounded-lg flex items-center justify-center gap-3 font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase group/btn overflow-hidden mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 group-hover/btn:opacity-40 transition-opacity blur"></div>
              <div className="absolute inset-0 bg-primary/10 group-hover/btn:bg-primary/20 transition-colors"></div>
              
              {isPending ? (
                <><Loader2 className="h-5 w-5 animate-spin text-primary relative z-10" /> <span className="text-white relative z-10">Sincronizando...</span></>
              ) : (
                <><span className="text-primary text-glow relative z-10">&gt; EJECUTAR TRANSACCIÓN</span></>
              )}
            </button>
            
            <div className="bg-background/50 border border-muted rounded-lg p-4">
              <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest mb-3">Protocolos Activos</p>
              <div className="flex justify-center gap-3">
                <div className="bg-card px-3 py-1.5 rounded border border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest">VISA</div>
                <div className="bg-card px-3 py-1.5 rounded border border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest">MASTER</div>
                <div className="bg-card px-3 py-1.5 rounded border border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest">SPEI</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
                <span>Cifrado Cuántico SSL Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
