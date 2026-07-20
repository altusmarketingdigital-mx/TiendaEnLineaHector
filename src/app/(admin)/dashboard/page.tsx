import React from 'react';
import { CreditCard, DollarSign, Package, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard General</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">Sincronización en tiempo real: Neon Postgres</span>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Ingresos Totales (Hoy)</h3>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold">$12,450.00</div>
          <p className="text-xs text-green-500 font-medium mt-1">+20.1% respecto a ayer</p>
        </div>
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Ventas Web</h3>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold">+235</div>
          <p className="text-xs text-green-500 font-medium mt-1">+18.0% respecto a ayer</p>
        </div>
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Ventas POS (Mostrador)</h3>
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold">+134</div>
          <p className="text-xs text-muted-foreground mt-1">+2% respecto a ayer</p>
        </div>
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Envíos Pendientes</h3>
            <Package className="h-5 w-5 text-destructive" />
          </div>
          <div className="text-3xl font-bold text-destructive">54</div>
          <p className="text-xs text-muted-foreground mt-1">Requieren despacho hoy</p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4">
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm xl:col-span-2">
          <div className="flex flex-col space-y-1.5 p-6 border-b">
            <h3 className="font-semibold leading-none tracking-tight text-lg">Transacciones Recientes</h3>
            <p className="text-sm text-muted-foreground">Últimas 5 ventas en la plataforma Omnicanal.</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[
                { id: "TX-84920", origin: "POS", user: "Cliente Mostrador", amount: 2199.99, status: "PAGADO", time: "Hace 2 min" },
                { id: "TX-84919", origin: "WEB", user: "juan@example.com", amount: 1599.99, status: "PAGADO", time: "Hace 15 min" },
                { id: "TX-84918", origin: "WEB", user: "maria@example.com", amount: 3499.00, status: "PENDIENTE", time: "Hace 1 hora" },
              ].map(tx => (
                <div key={tx.id} className="flex items-center p-3 hover:bg-muted/50 rounded-xl transition-colors">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${tx.origin === 'WEB' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                    {tx.origin}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-bold leading-none">{tx.user}</p>
                    <p className="text-xs text-muted-foreground">{tx.id} • {tx.time}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-bold text-lg">+${tx.amount.toFixed(2)}</div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded-md inline-block ${tx.status === 'PAGADO' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
