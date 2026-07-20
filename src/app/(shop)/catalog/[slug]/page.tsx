import React from 'react';
import ProductViewer3D from '@/components/3d/product-viewer';
import { ShoppingCart, CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail({ params }: { params: { slug: string } }) {
  // Mock product detail
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
         <Link href="/catalog" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
            ← Volver al Catálogo
         </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* 3D Viewer Left Side */}
        <div className="w-full">
          <ProductViewer3D />
          <div className="flex gap-4 mt-6 justify-center">
             <div className="h-20 w-20 bg-muted/80 rounded-xl border-2 border-primary cursor-pointer hover:shadow-md transition-all"></div>
             <div className="h-20 w-20 bg-muted/40 rounded-xl border-2 border-transparent cursor-pointer hover:border-primary/50 transition-all"></div>
             <div className="h-20 w-20 bg-muted/40 rounded-xl border-2 border-transparent cursor-pointer hover:border-primary/50 transition-all"></div>
          </div>
        </div>

        {/* Product Info Right Side */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">GPU</span>
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted px-4 py-1.5 rounded-full border border-border/50">NVIDIA</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">RTX 4090 OC Edition</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Tarjeta gráfica de rendimiento extremo impulsada por arquitectura Ada Lovelace. 
              Ideal para gaming 4K sin compromisos, diseño 3D avanzado e inteligencia artificial.
            </p>
          </div>

          <div className="bg-card border rounded-3xl p-8 shadow-sm flex flex-col gap-6 mt-2">
             <div className="flex items-end gap-4 border-b pb-6">
               <span className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">$1,599.99</span>
               <span className="text-muted-foreground mb-1 line-through font-semibold">$1,799.00</span>
             </div>

             <div className="flex flex-col gap-4 py-2">
               <div className="flex items-center gap-4 text-sm font-semibold">
                 <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-500" /></div>
                 <span>En Stock (4 unidades disponibles)</span>
               </div>
               <div className="flex items-center gap-4 text-sm font-semibold">
                 <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center"><Truck className="h-5 w-5 text-blue-500" /></div>
                 <span>Envío express gratis. Recíbelo mañana.</span>
               </div>
               <div className="flex items-center gap-4 text-sm font-semibold">
                 <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center"><ShieldCheck className="h-5 w-5 text-purple-500" /></div>
                 <span>Garantía extendida premium de 3 años.</span>
               </div>
             </div>

             <Link href="/cart" className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4">
               <ShoppingCart className="h-6 w-6" /> Añadir al Carrito
             </Link>
          </div>
          
          <div className="pt-6 border-t mt-2">
            <h3 className="text-xl font-bold mb-5">Especificaciones Técnicas</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm bg-muted/20 p-6 rounded-2xl border border-dashed border-border/50">
              <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">VRAM</span><span className="font-bold text-base">24GB GDDR6X</span></div>
              <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Reloj Base</span><span className="font-bold text-base">2.23 GHz</span></div>
              <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Consumo (TDP)</span><span className="font-bold text-base">450W</span></div>
              <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Ranuras</span><span className="font-bold text-base">3.5 Slots</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
