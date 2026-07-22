import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';

type Product = {
  id: number;
  slug: string;
  name: string;
  price: string;
  images: string[] | null;
  specs: unknown;
  stockQuantity: number;
  reservedQuantity: number;
};

export default function ProductSlider({ title, products }: { title: string, products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
        <h2 className="text-2xl font-extrabold text-secondary">{title}</h2>
        <Link href="/catalog" className="text-sm font-bold text-primary hover:underline">
          Ver todos
        </Link>
      </div>

      {/* Snap Scrolling Container */}
      <div className="flex overflow-x-auto gap-4 pb-6 pt-2 snap-x snap-mandatory scroll-small -mx-4 px-4 md:mx-0 md:px-0">
        {products.map(product => {
          const available = product.stockQuantity - product.reservedQuantity;
          const category = product.specs?.category ?? 'Componente';
          
          return (
            <div key={product.id} className="min-w-[260px] max-w-[260px] snap-start shrink-0 bg-white border border-border rounded-sm flex flex-col hover:shadow-lg transition-shadow overflow-hidden group">
              <Link href={`/catalog/${product.slug}`} className="flex-1 flex flex-col relative">
                {/* Product Image */}
                <div className="aspect-square p-4 flex items-center justify-center bg-white relative">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain mix-blend-multiply p-4"
                      sizes="260px"
                      unoptimized
                    />
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
                  <h3 className="font-semibold text-sm text-secondary line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug h-[40px]">
                    {product.name}
                  </h3>
                  
                  {/* Rating Mock */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`h-3 w-3 ${star <= 4 ? 'fill-[#ffb400] text-[#ffb400]' : 'fill-muted text-muted'}`} />
                    ))}
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
    </div>
  );
}
