"use client";

import React, { useState, useTransition } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Scan, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createSale, type CartItem } from '@/lib/actions/sales';
import type { ProductWithInventory } from '@/lib/queries/products';

type Props = {
  products: ProductWithInventory[];
};

type CartEntry = { product: ProductWithInventory; quantity: number };

export default function POSInterface({ products }: Props) {
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const addToCart = (product: ProductWithInventory) => {
    const available = product.stockQuantity - product.reservedQuantity;
    const inCart = cart.find(i => i.product.id === product.id)?.quantity ?? 0;
    if (inCart >= available) {
      showToast('error', `Stock máximo alcanzado para "${product.name}" (${available} disponibles).`);
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev
      .map(item => item.product.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter(item => item.quantity > 0)
    );
  };

  const handleCheckout = (paymentMethod: 'EFECTIVO' | 'TARJETA') => {
    if (cart.length === 0) return;

    startTransition(async () => {
      const items: CartItem[] = cart.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        unitPrice: Number(i.product.price),
      }));

      const result = await createSale({
        origin: 'POS',
        paymentMethod,
        items,
      });

      if (result.success) {
        setCart([]);
        showToast('success', `✅ Venta #${result.saleId} registrada en Neon exitosamente.`);
      } else {
        showToast('error', result.error);
      }
    });
  };

  const total = cart.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full w-full overflow-hidden absolute inset-0 pt-14">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold transition-all
          ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-destructive text-destructive-foreground'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {toast.message}
        </div>
      )}

      {/* Products Grid */}
      <div className="flex-1 flex flex-col h-full bg-muted/20 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar código de barras o nombre..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-card shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all text-lg"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="p-4 bg-secondary text-secondary-foreground rounded-2xl hover:bg-secondary/80 flex items-center gap-3 transition-colors">
            <Scan className="h-6 w-6" /><span className="font-semibold text-lg hidden sm:inline">Escanear</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-10">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
              <p className="text-2xl font-bold mb-2">Sin resultados</p>
              <p className="text-sm">Agrega productos a la base de datos o ajusta tu búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredProducts.map(product => {
                const available = product.stockQuantity - product.reservedQuantity;
                const specs = product.specs as any;
                return (
                  <div
                    key={product.id}
                    onClick={() => available > 0 && addToCart(product)}
                    className={`bg-card border rounded-3xl p-5 flex flex-col gap-4 select-none group transition-all
                      ${available > 0 ? 'cursor-pointer hover:border-primary hover:shadow-lg active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <div className="aspect-square bg-muted/50 rounded-2xl flex items-center justify-center">
                      <span className="text-muted-foreground/40 font-bold text-2xl">{((specs as Record<string, unknown>)?.category as string) ?? 'SKU'}</span>
                    </div>
                    <div className="flex flex-col flex-1 justify-between">
                      <h3 className="font-semibold text-sm line-clamp-2 leading-snug mb-3">{product.name}</h3>
                      <div className="flex justify-between items-end">
                        <span className="font-extrabold text-primary text-lg">${Number(product.price).toFixed(2)}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-md ${available > 0 ? 'bg-muted text-muted-foreground' : 'bg-destructive/10 text-destructive'}`}>
                          {available > 0 ? `Stock: ${available}` : 'Sin Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-[420px] bg-card border-l flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b">
          <h2 className="font-bold text-2xl tracking-tight mb-1">Orden Actual</h2>
          <p className="text-sm text-muted-foreground">POS • Mostrador</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-40">
              <Search className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">El carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex flex-col gap-2 p-4 bg-muted/30 rounded-2xl border border-border/50">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-semibold text-sm leading-tight flex-1">{item.product.name}</span>
                  <span className="font-bold">${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">${Number(item.product.price).toFixed(2)} c/u</span>
                  <div className="flex items-center gap-4 bg-card border rounded-xl p-1 shadow-sm">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="p-2 hover:bg-muted rounded-lg text-destructive transition-colors">
                      {item.quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                    </button>
                    <span className="font-bold w-6 text-center text-lg">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="p-2 hover:bg-muted rounded-lg text-primary transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t bg-muted/20">
          <div className="flex justify-between mb-3 text-sm font-medium">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${(total * 0.84).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-5 text-sm font-medium">
            <span className="text-muted-foreground">Impuestos (16%)</span>
            <span>${(total * 0.16).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-8 text-2xl font-extrabold tracking-tight">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleCheckout('EFECTIVO')}
              disabled={isPending || cart.length === 0}
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors active:scale-95 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Banknote className="h-6 w-6" />}
              <span>Efectivo</span>
            </button>
            <button
              onClick={() => handleCheckout('TARJETA')}
              disabled={isPending || cart.length === 0}
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <CreditCard className="h-6 w-6" />}
              <span>Tarjeta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
