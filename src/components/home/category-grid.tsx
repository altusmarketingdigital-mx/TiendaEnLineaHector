import React from 'react';
import { Laptop, Cpu, Monitor, Keyboard, Wifi, HardDrive } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Hardware', icon: Cpu, href: '/catalog?category=Hardware', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'Computadoras', icon: HardDrive, href: '/catalog?category=Computadoras', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Laptops', icon: Laptop, href: '/catalog?category=Laptops', color: 'text-green-500', bg: 'bg-green-500/10' },
  { name: 'Monitores', icon: Monitor, href: '/catalog?category=Monitores', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { name: 'Accesorios', icon: Keyboard, href: '/catalog?category=Accesorios', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { name: 'Redes', icon: Wifi, href: '/catalog?category=Redes', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link 
            key={cat.name} 
            href={cat.href}
            className="flex flex-col items-center justify-center p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md hover:border-primary transition-all group"
          >
            <div className={`p-4 rounded-xl mb-4 transition-transform group-hover:scale-110 ${cat.bg}`}>
              <Icon className={`w-8 h-8 ${cat.color}`} />
            </div>
            <span className="font-bold text-sm text-center">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
