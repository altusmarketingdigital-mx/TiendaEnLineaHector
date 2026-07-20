import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { getProducts } from '@/lib/queries/products';
import Link from 'next/link';

export const metadata = {
  title: 'Catálogo - TECH.STORE',
};

export default async function CatalogPage() {
  const products = await getProducts({ inStockOnly: false });

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">

        {/* Sidebar Filters (Cyberpuerta style) */}
        <aside className="w-full md:w-56 shrink-0 flex flex-col gap-4">
          <div className="bg-white border shadow-sm rounded-sm p-4">
            <h3 className="font-bold text-secondary border-b pb-2 mb-3">Categorías</h3>
            <ul className="text-sm space-y-2">
              {['Hardware', 'Computadoras y Laptops', 'Monitores', 'Accesorios', 'Software', 'Impresión'].map(cat => (
                <li key={cat}>
                  <Link href={`#`} className="text-foreground hover:text-primary transition-colors hover:underline">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border shadow-sm rounded-sm p-4">
            <h3 className="font-bold text-secondary border-b pb-2 mb-3">Filtros Populares</h3>
            <div className="flex flex-col gap-2">
              {['NVIDIA RTX', 'AMD Ryzen', 'Monitores 144Hz', 'Discos SSD'].map(filter => (
                <label key={filter} className="flex items-center gap-2 cursor-pointer group text-sm">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-4 w-4" />
                  <span className="text-foreground hover:text-primary transition-colors">{filter}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-white border shadow-sm rounded-sm p-4">
            <h3 className="font-bold text-secondary border-b pb-2 mb-3">Rango de Precio</h3>
            <input type="range" className="w-full accent-primary cursor-pointer" min="0" max="2000" />
            <div className="flex justify-between text-xs text-muted-foreground font-semibold mt-2">
              <span>$0</span><span>$20,000+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="bg-white border shadow-sm rounded-sm p-4 mb-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-secondary">Resultados de búsqueda</h1>
            <span className="text-sm font-semibold text-muted-foreground">
              {products.length} artículo{products.length !== 1 ? 's' : ''}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="bg-white border shadow-sm rounded-sm flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <p className="text-xl font-bold mb-2">No hay productos disponibles aún.</p>
              <p className="text-sm">Agrega productos desde el panel de administración para verlos aquí.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => {
                const available = product.stockQuantity - product.reservedQuantity;
                const category = (product.specs as any)?.category ?? 'Componente';
                
                return (
                  <div key={product.id} className="bg-white border border-border rounded-sm flex flex-col hover:shadow-lg transition-shadow overflow-hidden group">
                    <Link href={`/catalog/${product.slug}`} className="flex-1 flex flex-col relative">
                      {/* Product Image */}
                      <div className="aspect-square p-4 flex items-center justify-center bg-white relative">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="object-contain w-full h-full mix-blend-multiply" />
                        ) : (
                          <div className="font-bold text-muted-foreground/20 text-3xl uppercase text-center">
                            {category}
                          </div>
                        )}
                        {available <= 0 && (
                          <div className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
                            Agotado
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-1 border-t border-muted">
                        <h3 className="font-semibold text-sm text-secondary line-clamp-3 mb-2 group-hover:text-primary transition-colors leading-snug">
                          {product.name}
                        </h3>
                        
                        {/* Rating Mock */}
                        <div className="flex items-center gap-1 mb-3">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`h-3 w-3 ${star <= 4 ? 'fill-[#ffb400] text-[#ffb400]' : 'fill-muted text-muted'}`} />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">(12)</span>
                        </div>
                        
                        <div className="mt-auto flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">Precio Especial</span>
                          <span className="font-bold text-2xl text-destructive tracking-tight">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          <span className="text-xs text-green-600 font-semibold mb-3">Envío Gratis</span>
                        </div>
                      </div>
                    </Link>

                    {/* Add to Cart Button */}
                    <div className="px-4 pb-4">
                      <button
                        disabled={available <= 0}
                        className="w-full bg-[#ff7a00] hover:bg-[#e66e00] text-white py-2.5 rounded-sm flex items-center justify-center gap-2 font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {available <= 0 ? 'Sin Stock' : 'Agregar al carrito'}
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
