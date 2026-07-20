"use client";

import React, { useState, useTransition } from 'react';
import { Trash2, ArrowRight, ShieldCheck, CreditCard, Banknote, Loader2, AlertCircle } from 'lucide-react';
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
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-bold text-secondary border-b pb-4 mb-6">Mi Carrito de Compras</h1>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 font-semibold text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" /> {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="bg-white border shadow-sm rounded-sm text-center py-20 text-muted-foreground">
              <p className="text-xl font-bold mb-4">Tu carrito está vacío</p>
              <Link href="/catalog" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-sm font-bold hover:bg-primary/90 transition-colors">
                Seguir comprando
              </Link>
            </div>
          ) : (
            <div className="bg-white border shadow-sm rounded-sm flex flex-col divide-y">
              {cart.map(item => (
                <div key={item.productId} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="h-20 w-20 bg-muted/20 border flex items-center justify-center font-bold text-muted-foreground/30 text-xs uppercase shrink-0">
                    {item.category ?? 'SKU'}
                  </div>
                  <div className="flex-1 flex flex-col md:flex-row justify-between w-full gap-4">
                    <div className="flex flex-col">
                      <Link href={`/catalog/${item.productId}`} className="font-semibold text-sm text-secondary hover:text-primary transition-colors leading-snug max-w-md">
                        {item.name}
                      </Link>
                      <span className="text-xs text-muted-foreground mt-1">ID: {item.productId}</span>
                      <span className="text-xs text-green-600 font-semibold mt-1">Disponible en bodega principal</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-6 md:w-auto w-full justify-between md:justify-end">
                      <div className="flex flex-col text-right">
                        <span className="text-xs text-muted-foreground">Precio Unitario</span>
                        <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-sm bg-white">
                          <button onClick={() => updateQty(item.productId, -1)} className="px-3 py-1 hover:bg-muted text-secondary font-bold transition-colors">−</button>
                          <span className="font-bold text-sm w-6 text-center border-x py-1">{item.quantity}</span>
                          <button onClick={() => updateQty(item.productId, 1)} className="px-3 py-1 hover:bg-muted text-secondary font-bold transition-colors">+</button>
                        </div>
                        <button
                          onClick={() => updateQty(item.productId, -item.quantity)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors ml-2"
                          title="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex flex-col text-right w-24">
                        <span className="text-xs text-muted-foreground">Subtotal</span>
                        <span className="font-bold text-xl text-destructive">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {cart.length > 0 && (
            <div className="flex justify-between items-center bg-white border shadow-sm rounded-sm p-4">
               <Link href="/catalog" className="text-primary font-semibold hover:underline text-sm">
                 ← Continuar comprando
               </Link>
               <button
                 onClick={() => setCart([])}
                 className="text-xs text-muted-foreground hover:text-destructive hover:underline"
               >
                 Vaciar Carrito
               </button>
            </div>
          )}
        </div>

        {/* Order Summary + Checkout */}
        <div className="lg:w-1/3">
          <div className="bg-white border shadow-sm rounded-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4 border-b pb-2 text-secondary">Resumen de tu pedido</h2>

            <div className="flex flex-col gap-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal (sin IVA):</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA (16%):</span>
                <span className="font-semibold">${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold border-b pb-4">
                <span>Costo de envío:</span>
                <span>$0.00 (Gratis)</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="font-bold text-secondary text-base">Total a pagar:</span>
                <span className="text-3xl font-black text-destructive tracking-tight">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Main CTA: Checkout Pro */}
            <button
              onClick={handleCheckout}
              disabled={isPending || cart.length === 0}
              className="w-full py-3 bg-[#f26522] hover:bg-[#e05512] text-white rounded-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-lg mb-4 disabled:opacity-60 disabled:cursor-not-allowed uppercase"
            >
              {isPending ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Procesando...</>
              ) : (
                <><ArrowRight className="h-5 w-5" /> Proceder al pago</>
              )}
            </button>
            
            {/* Payment Method Icons (Mercado Pago style info) */}
            <div className="bg-blue-50 border border-blue-100 rounded-sm p-3 mb-6">
              <p className="text-xs text-center text-blue-800 font-semibold mb-2">Paga seguro con Mercado Pago</p>
              <div className="flex justify-center gap-2">
                <div className="bg-white px-2 py-1 rounded border text-[10px] font-bold text-slate-600">VISA</div>
                <div className="bg-white px-2 py-1 rounded border text-[10px] font-bold text-slate-600">MASTERCARD</div>
                <div className="bg-white px-2 py-1 rounded border text-[10px] font-bold text-slate-600">SPEI</div>
                <div className="bg-white px-2 py-1 rounded border text-[10px] font-bold text-slate-600">OXXO</div>
              </div>
            </div>

            {/* Security Footer */}
            <div className="flex flex-col gap-2 pt-4 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Compra Segura - Cifrado SSL 256 bits</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span>Devoluciones en los primeros 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
