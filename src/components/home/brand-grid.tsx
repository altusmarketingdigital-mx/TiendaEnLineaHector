import React from 'react';

const brands = [
  { name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', color: 'hover:border-[#76b900]' },
  { name: 'AMD', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg', color: 'hover:border-[#ed1c24]' },
  { name: 'INTEL', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg', color: 'hover:border-[#0071c5]' },
  { name: 'ASUS', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg', color: 'hover:border-[#00539b]' },
  { name: 'CORSAIR', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Corsair_logo.svg', color: 'hover:border-[#ffcc00]' },
  { name: 'MSI', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/MSI_Logo.svg', color: 'hover:border-[#ed1c24]' }
];

export default function BrandGrid() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-extrabold text-secondary mb-6 border-b border-border pb-2">Encuentra solo las mejores marcas</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <div 
            key={brand.name} 
            className={`flex items-center justify-center p-6 bg-white border border-border rounded-sm hover:shadow-md transition-all cursor-pointer group ${brand.color}`}
          >
            <img 
              src={brand.logo} 
              alt={`Logotipo de ${brand.name}`} 
              className="h-10 md:h-12 w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
