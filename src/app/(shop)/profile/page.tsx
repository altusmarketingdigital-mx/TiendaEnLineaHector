import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getOrderHistory } from '@/lib/queries/orders';
import { User, ShoppingBag, Package, Calendar, CreditCard, Globe, Monitor } from 'lucide-react';

export const metadata = {
  title: 'Mi Perfil - TECH.STORE',
};

const statusColors: Record<string, string> = {
  PAGADO: 'bg-green-500/15 text-green-500 border border-green-500/20',
  PENDIENTE: 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/20',
  CANCELADO: 'bg-destructive/15 text-destructive border border-destructive/20',
};

const originIcon = { WEB: Globe, POS: Monitor };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login?callbackUrl=/profile');

  const userId = Number((session.user as any).id);
  const orders = await getOrderHistory(userId);
  const role = (session.user as any).role ?? 'CLIENTE';

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-5xl">
      {/* User Header */}
      <div className="bg-card border rounded-3xl p-8 mb-10 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-4xl font-black shadow-lg shadow-primary/30 shrink-0">
          {session.user.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{session.user.name}</h1>
          <p className="text-muted-foreground text-lg">{session.user.email}</p>
          <div className="flex gap-3 justify-center md:justify-start mt-2">
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full
              ${role === 'ADMINISTRADOR' ? 'bg-accent/15 text-accent border border-accent/20' :
                role === 'EMPLEADO' ? 'bg-primary/15 text-primary border border-primary/20' :
                'bg-muted text-muted-foreground border'}`}>
              {role}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-muted text-muted-foreground border">
              {orders.length} orden{orders.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-3">
          <ShoppingBag className="h-6 w-6 text-primary" /> Historial de Compras
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-3xl text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-bold mb-2">Aún no tienes compras</p>
            <p className="text-sm opacity-70">Explora nuestro catálogo para hacer tu primera compra.</p>
            <a href="/catalog" className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
              Ir al Catálogo
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const OriginIcon = originIcon[order.origin];
              return (
                <div key={order.saleId} className="bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                        <OriginIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-black text-lg">Orden #{order.saleId}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                            : '—'}
                          <span className="text-border">•</span>
                          {order.origin === 'WEB' ? 'Compra en línea' : 'Compra en tienda'}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                      <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${statusColors[order.status] ?? ''}`}>
                        {order.status}
                      </span>
                      {order.paymentMethod && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <CreditCard className="h-3 w-3" /> {order.paymentMethod}
                        </div>
                      )}
                      <span className="font-black text-2xl text-primary">${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="p-6 flex flex-col gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground/50 font-bold text-xs">
                            {item.quantity}×
                          </div>
                          <span className="font-semibold">{item.productName}</span>
                        </div>
                        <span className="font-bold text-muted-foreground">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
