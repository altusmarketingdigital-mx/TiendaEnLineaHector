import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Truck, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight text-primary">
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1 py-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/shipments" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
                <Truck className="h-4 w-4" />
                Control de Envíos
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Back-Office Hub</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
