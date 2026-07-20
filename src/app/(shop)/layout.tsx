import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, Phone, HelpCircle } from 'lucide-react';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground relative selection:bg-primary selection:text-black">
      
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[150px] rounded-full"></div>
      </div>

      {/* Main Floating Header */}
      <div className="sticky top-4 z-50 px-4 mb-8">
        <header className="container mx-auto bg-card/60 backdrop-blur-xl border neon-border shadow-2xl rounded-2xl py-3 px-6 flex items-center justify-between gap-6 relative overflow-hidden group">
          {/* subtle header inner glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <div className="text-2xl font-black text-white tracking-tighter text-glow">
              TECH<span className="text-primary">STORE</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl flex relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <input 
              type="text" 
              placeholder="Buscar componentes..." 
              className="relative w-full bg-background border border-muted/50 px-4 py-2.5 rounded-l-lg outline-none focus:border-primary text-sm text-foreground transition-all"
            />
            <button className="relative bg-gradient-to-r from-primary to-secondary text-black px-6 py-2.5 rounded-r-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center">
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
              <div className="bg-background/80 p-2.5 rounded-xl border border-muted group-hover:border-primary/50 transition-colors">
                <User className="h-5 w-5" />
              </div>
            </Link>
            
            <Link href="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors group relative">
              <div className="bg-background/80 p-2.5 rounded-xl border border-muted group-hover:border-secondary/50 transition-colors relative">
                <ShoppingCart className="h-5 w-5 group-hover:text-secondary" />
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(181,53,246,0.8)]">
                  0
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Secondary Nav underneath */}
        <nav className="container mx-auto mt-3 flex items-center justify-center space-x-8 text-sm font-bold text-muted-foreground">
          <Link href="/catalog" className="hover:text-primary hover:text-glow transition-all">Hardware</Link>
          <Link href="/catalog" className="hover:text-primary hover:text-glow transition-all">Computadoras</Link>
          <Link href="/catalog" className="hover:text-primary hover:text-glow transition-all">Periféricos</Link>
          <span className="text-border">|</span>
          <Link href="/pc-builder" className="hover:text-secondary text-glow text-secondary transition-all flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse"></div>
            Arma tu PC
          </Link>
        </nav>
      </div>

      <main className="flex-1 flex flex-col z-10 w-full max-w-[100vw] overflow-hidden">
        {children}
      </main>

      <footer className="bg-card border-t border-border mt-auto z-10 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-muted-foreground">
          <div>
            <h4 className="font-bold text-foreground mb-4 text-glow">TECHSTORE</h4>
            <p className="text-xs mb-4">La mejor experiencia en armado de PC y hardware de alto rendimiento.</p>
            <div className="text-xs opacity-50">© 2026. Todos los derechos reservados.</div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Garantías</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li><Link href="/pc-builder" className="hover:text-primary transition-colors">PC Builder Interactivo</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Administración</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Seguridad</h4>
            <p className="mb-4 text-xs">Transacciones encriptadas y protegidas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
