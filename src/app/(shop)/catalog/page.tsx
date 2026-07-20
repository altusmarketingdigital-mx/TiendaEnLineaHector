import React from 'react';
import { ShoppingCart, Star, Cpu } from 'lucide-react';
import { getProducts } from '@/lib/queries/products';
import Link from 'next/link';

export const metadata = {
  title: 'Catálogo TECH - Alto Rendimiento',
};

export default async function CatalogPage() {
  const products = await getProducts({ inStockOnly: false });

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      
      <div className="flex flex-col md:flex-row gap-8 relative z-10">

        {/* Cyber Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl p-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
            <h3 className="font-black text-white text-glow mb-4 flex items-center gap-2 relative">
              <Cpu className="h-5 w-5 text-primary" /> CATEGORÍAS
            </h3>
            <ul className="text-sm space-y-3 relative">
              {['GPUs (Tarjetas Gráficas)', 'CPUs (Procesadores)', 'Tarjetas Madre', 'Memoria RAM', 'Almacenamiento NVMe', 'Fuentes de Poder'].map(cat => (
                <li key={cat}>
                  <Link href={`#`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all hover:translate-x-1">
                    <span className="h-1 w-1 bg-secondary rounded-full"></span> {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl p-5 shadow-2xl relative">
            <h3 className="font-black text-white text-glow mb-4">FILTROS PRO</h3>
            <div className="flex flex-col gap-3">
              {['NVIDIA RTX 40 Series', 'AMD Ryzen 9000', 'PCIe 5.0 Ready', 'DDR5'].map(filter => (
                <label key={filter} className="flex items-center gap-3 cursor-pointer group text-sm">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none h-4 w-4 rounded border border-muted focus:outline-none focus:ring-1 focus:ring-primary checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                    <div className="absolute opacity-0 peer-checked:opacity-100 text-black pointer-events-none">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-white transition-colors">{filter}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* 3D Product Grid */}
        <div className="flex-1">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 mb-6 flex justify-between items-center shadow-lg">
            <h1 className="text-xl font-bold text-white text-glow">Resultados del Sistema</h1>
            <span className="text-xs font-black px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md">
              {products.length} MÓDULOS ENCONTRADOS
            </span>
          </div>

          {products.length === 0 ? (
            <div className="bg-card border border-border rounded-xl flex flex-col items-center justify-center py-20 text-center text-muted-foreground shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <p className="text-2xl font-black mb-2 text-white">SISTEMA VACÍO</p>
              <p className="text-sm">Aún no hay componentes registrados en la matriz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
              {products.map(product => {
                const available = product.stockQuantity - product.reservedQuantity;
                const category = (product.specs as any)?.category ?? 'COMPONENTE';
                
                return (
                  <div key={product.id} className="card-3d bg-card border border-border rounded-2xl flex flex-col relative overflow-hidden group">
                    {/* Glowing background blob */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 z-0"></div>
                    
                    <Link href={`/catalog/${product.slug}`} className="flex-1 flex flex-col relative z-10">
                      {/* Image container */}
                      <div className="aspect-square p-6 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10 pointer-events-none"></div>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-700 relative z-0" />
                        ) : (
                          <div className="font-black text-muted-foreground/10 text-4xl uppercase text-center rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500">
                            {category}
                          </div>
                        )}
                        {available <= 0 && (
                          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)] z-20">
                            OFFLINE
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-card/80 backdrop-blur text-primary text-[9px] font-bold px-2 py-0.5 rounded border border-primary/30 z-20">
                          {category}
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="px-5 pt-2 pb-5 flex flex-col flex-1 relative z-20">
                        <h3 className="font-bold text-sm text-white line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-tight">
                          {product.name}
                        </h3>
                        
                        <div className="mt-auto flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Valor de Crédito</span>
                          <span className="font-black text-2xl text-white tracking-tighter text-glow">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Add to Cart */}
                    <div className="px-5 pb-5 relative z-20">
                      <button
                        disabled={available <= 0}
                        className="w-full relative bg-card border border-primary/50 text-primary py-3 rounded-xl flex items-center justify-center gap-2 font-black transition-all hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        <ShoppingCart className="h-4 w-4 relative z-10" />
                        <span className="relative z-10">{available <= 0 ? 'SIN STOCK' : 'INICIALIZAR COMPRA'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
