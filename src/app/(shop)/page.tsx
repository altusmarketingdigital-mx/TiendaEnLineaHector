import React from 'react';
import HeroCarousel from '@/components/home/hero-carousel';
import CategoryGrid from '@/components/home/category-grid';
import ProductSlider from '@/components/home/product-slider';
import LoginCTA from '@/components/home/login-cta';
import BrandGrid from '@/components/home/brand-grid';
import ValueProps from '@/components/home/value-props';
import Testimonials from '@/components/home/testimonials';
import HelpBanner from '@/components/home/help-banner';
import { getProducts } from '@/lib/queries/products';
import Link from 'next/link';

export const metadata = {
  title: 'Hardware, Computadoras, Laptops & Más | TECH.STORE',
  description: 'La tienda en línea líder en tecnología y hardware de alto rendimiento.',
};

export default async function ShopHome() {
  const products = await getProducts({ inStockOnly: false });
  
  // Helper to filter products or return a fallback slice so the layout is always visible
  const getFiltered = (keyword: string, fallbackStart: number, fallbackEnd: number) => {
    const filtered = products.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()) || JSON.stringify(p.specs).toLowerCase().includes(keyword.toLowerCase()));
    return filtered.length > 0 ? filtered : products.slice(fallbackStart, fallbackEnd);
  };

  const destacados = products.slice(0, 10);
  const masVendidos = products.slice(1, 11);
  const laptops = getFiltered('laptop', 0, 8);
  const pcs = getFiltered('pc', 2, 10);
  const monitores = getFiltered('monitor', 1, 9);
  const ssd = getFiltered('ssd', 0, 6);
  const ups = getFiltered('ups', 2, 7);

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-6">
        
        {/* 1. Carrusel */}
        <HeroCarousel />
        
        {/* 2. Descubre nuestras categorías */}
        <div className="mb-12">
          <h2 className="text-2xl font-extrabold text-secondary mb-6 border-b border-border pb-2">Descubre nuestras categorías</h2>
          <CategoryGrid />
        </div>
        
        {/* 3. Destacados del día */}
        <ProductSlider title="Destacados del día ¡no los dejes pasar!" products={destacados} />
        
        {/* 4. ¿Ya tienes cuenta? */}
        <LoginCTA />
        
        {/* 5. Encuentra solo las mejores marcas */}
        <BrandGrid />
        
        {/* 6. Lo más vendido */}
        <ProductSlider title="Lo más vendido" products={masVendidos} />
        
        {/* 7. Laptops */}
        <ProductSlider title="Lo más relevante en Laptops" products={laptops} />

        {/* Banner estático intermedio */}
        <Link href="/pc-builder" className="block w-full h-[150px] md:h-[200px] mb-12 rounded-2xl overflow-hidden relative group shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 z-10">
            <div>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-2">Arma tu PC Ideal</h3>
              <p className="text-gray-300 text-lg">Configurador inteligente de hardware con compatibilidad garantizada</p>
            </div>
            <button className="hidden md:block px-8 py-3 bg-[#ff7a00] hover:bg-[#ff8d0a] text-white font-bold rounded-sm shadow-md transition-colors">
              Iniciar Armador
            </button>
          </div>
        </Link>
        
        {/* 8. PC de Escritorio */}
        <ProductSlider title="Lo más relevante en PC's de Escritorio" products={pcs} />
        
        {/* 9. Monitores */}
        <ProductSlider title="Lo más relevante en Monitores" products={monitores} />
        
        {/* 10. SSD */}
        <ProductSlider title="Lo más relevante en SSD" products={ssd} />
        
        {/* 11. No Break UPS */}
        <ProductSlider title="Lo más relevante en No Break UPS" products={ups} />
        
        {/* 12. Somos tu mejor opción */}
        <ValueProps />
        
        {/* 13. Opiniones de nuestros clientes */}
        <Testimonials />
        
        {/* 14. Necesitas ayuda */}
        <HelpBanner />

      </div>
    </div>
  );
}
