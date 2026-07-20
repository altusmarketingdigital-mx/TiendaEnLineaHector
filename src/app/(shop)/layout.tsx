import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, Phone, HelpCircle } from 'lucide-react';
import { auth } from '@/auth';
import LogoutButton from '@/components/layout/logout-button';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen w-full">
      
      {/* Top micro-bar */}
      <div className="bg-secondary text-secondary-foreground py-2 md:py-1 text-xs">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> 800 123 4567</span>
            <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3" /> Ayuda</span>
          </div>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <span className="text-muted-foreground">Hola, <b>{session.user.name?.split(' ')[0]}</b></span>
                <LogoutButton variant="text" />
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:underline">Iniciar Sesión</Link>
                <Link href="/auth/register" className="hover:underline">Crear Cuenta</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-border shadow-sm py-3 md:py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 md:gap-6">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <div className="text-2xl md:text-3xl font-black text-secondary tracking-tighter">
                TECH<span className="text-primary">STORE</span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-3xl">
              <input 
                type="text" 
                placeholder="¿Qué estás buscando? (Ej. Tarjeta de Video RTX 4090)" 
                className="w-full border-2 border-primary/20 bg-muted/20 px-4 py-2 rounded-l-md outline-none focus:border-primary transition-colors text-sm"
              />
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-r-md font-bold hover:bg-primary/90 transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* User & Cart */}
            <div className="flex items-center gap-4 md:gap-6 shrink-0 relative z-50">
              <Link href="/profile" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors group relative z-50 cursor-pointer">
                <div className="bg-muted p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden lg:flex flex-col text-xs">
                  <span className="text-muted-foreground">Bienvenido</span>
                  <span className="font-bold text-sm text-primary">Mi Cuenta</span>
                </div>
              </Link>
              
              <Link href="/cart" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors group relative z-50 cursor-pointer">
                <div className="bg-muted p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                    0
                  </span>
                </div>
                <div className="hidden lg:flex flex-col text-xs">
                  <span className="text-muted-foreground">Mi Carrito</span>
                  <span className="font-bold text-sm">$0.00</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="flex md:hidden w-full mt-3">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              className="w-full border-2 border-primary/20 bg-muted/20 px-3 py-2 rounded-l-md outline-none focus:border-primary transition-colors text-sm"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md font-bold hover:bg-primary/90 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Nav Categories */}
      <nav className="bg-secondary text-secondary-foreground shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center">
          <div className="bg-primary px-3 md:px-6 py-3 font-bold flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors shrink-0 text-sm md:text-base">
            <Menu className="h-4 w-4 md:h-5 md:w-5" /> <span className="hidden md:inline">Todos los Productos</span>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6 px-4 md:px-6 text-xs md:text-sm font-semibold overflow-x-auto whitespace-nowrap scrollbar-hide flex-1">
            <Link href="/catalog?cat=Hardware" className="hover:text-primary transition-colors shrink-0">Hardware</Link>
            <Link href="/catalog?cat=Laptops" className="hover:text-primary transition-colors shrink-0">Laptops</Link>
            <Link href="/catalog?cat=Monitores" className="hover:text-primary transition-colors shrink-0">Monitores</Link>
            <Link href="/catalog?cat=Accesorios" className="hover:text-primary transition-colors shrink-0">Accesorios</Link>
            <span className="text-secondary-foreground/30 shrink-0">|</span>
            <Link href="/pc-builder" className="hover:text-primary transition-colors text-primary font-bold shrink-0">Arma tu PC</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col bg-background">
        {children}
      </main>

      <footer className="bg-secondary text-secondary-foreground/70 py-12 border-t border-secondary-foreground/10 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-bold text-white mb-4">Acerca de TECHSTORE</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">¿Quiénes somos?</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Aviso de Privacidad</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Atención al Cliente</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Garantías y Devoluciones</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Métodos de Pago</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li><Link href="/pc-builder" className="hover:text-primary transition-colors">Arma tu PC</Link></li>
              <li><Link href="/pos" className="hover:text-primary transition-colors">Punto de Venta (Empleados)</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Administración</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Pago Seguro</h4>
            <p className="mb-4">Tus transacciones están protegidas por Mercado Pago.</p>
            <div className="text-xs opacity-50">© 2026 TECHSTORE. Todos los derechos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
