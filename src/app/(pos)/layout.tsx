import React from 'react';
import Link from 'next/link';
import { Calculator, User, LayoutDashboard } from 'lucide-react';

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* POS UI usually hides standard headers/footers for max screen space */}
      <header className="flex h-14 items-center justify-between border-b bg-card px-6 shadow-sm z-10">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tighter">
          <Calculator className="h-6 w-6" />
          <span>TECH.POS</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent/10 hover:text-accent transition-colors font-semibold">
            <LayoutDashboard className="h-4 w-4" />
            Volver al Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">Caja 01</div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Operador Activo</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
}
