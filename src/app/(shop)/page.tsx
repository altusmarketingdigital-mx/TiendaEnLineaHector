import React from 'react';
import HeroCarousel from '@/components/home/hero-carousel';
import CategoryGrid from '@/components/home/category-grid';
import ProductSlider from '@/components/home/product-slider';
import { getProducts } from '@/lib/queries/products';
import Link from 'next/link';

export const metadata = {
  title: 'Hardware, Computadoras, Laptops & Más | TECH.STORE',
  description: 'La tienda en línea líder en tecnología y hardware de alto rendimiento.',
};

export default async function ShopHome() {
  // Fetch latest products
  const products = await getProducts({ inStockOnly: false });
  
  // Split products to create different sliders (mocking sections)
  const offers = products.slice(0, 10);
  const recommended = products.slice(2, 12);

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-6">
        
        {/* 1. Main Hero Carousel */}
        <HeroCarousel />
        
        {/* 2. Fast Categories Grid */}
        <CategoryGrid />
        
        {/* 3. Product Slider: Ofertas Especiales */}
        <ProductSlider title="Ofertas Especiales" products={offers} />
        
        {/* 4. Secondary Banner (Static) */}
        <Link href="/pc-builder" className="block w-full h-[150px] md:h-[200px] mb-12 rounded-2xl overflow-hidden relative group">
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
        
        {/* 5. Product Slider: Recomendados para ti */}
        <ProductSlider title="Recomendados para ti" products={recommended.length > 0 ? recommended : offers} />

      </div>
    </div>
  );
}
