import React from 'react';

const brands = [
  { name: 'NVIDIA', color: 'bg-[#76b900]' },
  { name: 'AMD', color: 'bg-[#ed1c24]' },
  { name: 'INTEL', color: 'bg-[#0071c5]' },
  { name: 'ASUS', color: 'bg-[#00539b]' },
  { name: 'CORSAIR', color: 'bg-[#ffcc00]' },
  { name: 'MSI', color: 'bg-[#ed1c24]' }
];

export default function BrandGrid() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-extrabold text-secondary mb-6 border-b border-border pb-2">Encuentra solo las mejores marcas</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <div 
            key={brand.name} 
            className="flex items-center justify-center p-8 bg-white border border-border rounded-sm hover:border-primary hover:shadow-md transition-all cursor-pointer group"
          >
            <span className={`font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-700 to-gray-900 group-hover:${brand.color.replace('bg-', 'from-').replace(']', ']/80')} transition-all`}>
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
