import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { name: 'Hardware',     image: '/categories/hardware.png',     href: '/catalog?category=Hardware',     border: 'hover:border-orange-400' },
  { name: 'Computadoras', image: '/categories/computadoras.png', href: '/catalog?category=Computadoras', border: 'hover:border-blue-400' },
  { name: 'Laptops',      image: '/categories/laptops.png',      href: '/catalog?category=Laptops',      border: 'hover:border-green-400' },
  { name: 'Monitores',    image: '/categories/monitores.png',    href: '/catalog?category=Monitores',    border: 'hover:border-purple-400' },
  { name: 'Accesorios',   image: '/categories/accesorios.png',   href: '/catalog?category=Accesorios',   border: 'hover:border-pink-400' },
  { name: 'Redes',        image: '/categories/redes.png',        href: '/catalog?category=Redes',        border: 'hover:border-cyan-400' },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-12">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={cat.href}
          className={`flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-transparent shadow-sm hover:shadow-lg ${cat.border} transition-all duration-200 group`}
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-200">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <span className="font-bold text-xs md:text-sm text-center text-foreground">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
