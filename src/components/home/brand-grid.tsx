"use client";

import React from 'react';
import Image from 'next/image';

const brands = [
  { name: 'NVIDIA', logo: 'https://cdn.simpleicons.org/nvidia/76b900', fallback: '', color: 'hover:border-[#76b900]' },
  { name: 'AMD', logo: 'https://cdn.simpleicons.org/amd/ed1c24', fallback: '', color: 'hover:border-[#ed1c24]' },
  { name: 'INTEL', logo: 'https://cdn.simpleicons.org/intel/0071c5', fallback: '', color: 'hover:border-[#0071c5]' },
  { name: 'ASUS', logo: 'https://cdn.simpleicons.org/asus/00539b', fallback: '', color: 'hover:border-[#00539b]' },
  { name: 'CORSAIR', logo: 'https://cdn.simpleicons.org/corsair/ffcc00', fallback: '', color: 'hover:border-[#ffcc00]' },
  { name: 'MSI', logo: 'https://cdn.simpleicons.org/msi/ed1c24', fallback: 'https://logo.clearbit.com/msi.com', color: 'hover:border-[#ed1c24]' }
];

export default function BrandGrid() {
  const [imgErrors, setImgErrors] = React.useState<Record<string, boolean>>({});

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-extrabold text-secondary mb-6 border-b border-border pb-2">Encuentra solo las mejores marcas</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <div 
            key={brand.name} 
            className={`flex items-center justify-center p-6 bg-white border border-border rounded-sm hover:shadow-md transition-all cursor-pointer group ${brand.color}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imgErrors[brand.name] ? (brand.fallback || `https://placehold.co/200x80/ffffff/333333.png?text=${brand.name}`) : brand.logo}
              alt={`Logotipo de ${brand.name}`} 
              onError={() => setImgErrors(prev => ({...prev, [brand.name]: true}))}
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
