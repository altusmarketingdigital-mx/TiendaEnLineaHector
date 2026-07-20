import React from 'react';

export default function ShopHome() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-24 px-4 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
        Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">TECH.STORE</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
        La plataforma definitiva para armar tu PC de alto rendimiento o encontrar los mejores componentes. Descubre la experiencia Omnichannel.
      </p>
      <div className="flex gap-4 justify-center">
        <a href="/catalog" className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95">
          Explorar Catálogo
        </a>
        <a href="/pc-builder" className="px-8 py-3 rounded-md bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95">
          Armar una PC
        </a>
      </div>
    </div>
  );
}
