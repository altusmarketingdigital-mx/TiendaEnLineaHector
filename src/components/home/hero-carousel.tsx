"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Serie RTX 5000",
    subtitle: "El rendimiento absoluto ya está aquí",
    image: "https://images.unsplash.com/photo-1621508654686-809f23efdabc?auto=format&fit=crop&q=80&w=2000",
    color: "from-blue-900 to-black"
  },
  {
    id: 2,
    title: "Ryzen 9 9950X",
    subtitle: "Domina el juego y la productividad",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=2000",
    color: "from-red-900 to-black"
  },
  {
    id: 3,
    title: "Monitores Ultrawide",
    subtitle: "Inmersión total en 1440p y 240Hz",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=2000",
    color: "from-purple-900 to-black"
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-black overflow-hidden rounded-none md:rounded-2xl mb-8 group shadow-xl">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].color} opacity-80 z-10 mix-blend-multiply`} />
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={current === 0}
            unoptimized
          />
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-24">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight"
            >
              {slides[current].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-3xl text-gray-200 mt-4 max-w-2xl font-medium"
            >
              {slides[current].subtitle}
            </motion.p>
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl w-fit hover:bg-primary/90 hover:scale-105 transition-all shadow-lg"
            >
              Ver Promoción
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${current === i ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white/80'}`} 
          />
        ))}
      </div>
    </div>
  );
}
