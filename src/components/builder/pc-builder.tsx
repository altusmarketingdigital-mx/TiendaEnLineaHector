"use client";

import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Cpu, HardDrive, Monitor, Zap, Loader2, ShoppingCart } from 'lucide-react';
import type { ProductWithInventory } from '@/lib/queries/products';

const steps = [
  { id: 'CPU', label: 'Procesador', icon: Cpu },
  { id: 'Motherboard', label: 'Tarjeta Madre', icon: Monitor },
  { id: 'RAM', label: 'Memoria RAM', icon: HardDrive },
  { id: 'GPU', label: 'Tarjeta Gráfica', icon: Zap },
];

type Props = {
  productsByCategory: Record<string, ProductWithInventory[]>;
};

export default function PCBuilder({ productsByCategory }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, ProductWithInventory>>({});

  const handleSelect = (category: string, item: ProductWithInventory) => {
    // When CPU changes, clear Motherboard selection (socket may be different)
    if (category === 'CPU') {
      setSelections({ CPU: item });
    } else {
      setSelections(prev => ({ ...prev, [category]: item }));
    }
  };

  const currentCategory = steps[currentStep].id;
  let availableComponents = productsByCategory[currentCategory] ?? [];

  // ⚡ STRICT COMPATIBILITY: Filter motherboards by the CPU socket
  if (currentCategory === 'Motherboard' && selections['CPU']) {
    const cpuSocket = (selections['CPU'].specs as any)?.socket;
    if (cpuSocket) {
      availableComponents = availableComponents.filter(
        c => (c.specs as any)?.socket === cpuSocket
      );
    }
  }

  const total = Object.values(selections).reduce((acc, item) => acc + Number(item.price), 0);
  const allSelected = steps.every(s => selections[s.id]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto py-12">
      <div className="lg:w-2/3 flex flex-col gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Armador de PC</h1>
          <p className="text-lg text-muted-foreground">Motor de compatibilidad estricta. Solo verás componentes que funcionan juntos.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-8 relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-1 before:bg-muted before:-z-10 before:w-[90%] before:mx-auto">
          {steps.map((step, idx) => {
            const isCompleted = !!selections[step.id];
            const isActive = idx === currentStep;
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 bg-background px-2">
                <button
                  onClick={() => setCurrentStep(idx)}
                  className={`h-14 w-14 rounded-full flex items-center justify-center border-4 transition-all shadow-sm
                    ${isActive ? 'border-primary bg-primary text-primary-foreground scale-110 shadow-primary/30' :
                      isCompleted ? 'border-green-500 bg-card text-green-500' : 'border-muted bg-card text-muted-foreground'}`}
                >
                  <Icon className="h-6 w-6" />
                </button>
                <span className={`text-sm font-bold ${isActive ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Component Selection */}
        <div className="mt-8 bg-card border rounded-3xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold mb-8">Elige tu {steps[currentStep].label}</h2>

          {availableComponents.length === 0 ? (
            <div className="col-span-2 text-center py-16 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/30">
              <p className="font-medium text-lg">
                {currentCategory === 'Motherboard' && selections['CPU']
                  ? `No hay Tarjetas Madre con socket ${(selections['CPU'].specs as any)?.socket ?? ''} en inventario.`
                  : 'Sin productos en esta categoría. Agrega componentes desde el admin.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableComponents.map((item) => {
                const isSelected = selections[currentCategory]?.id === item.id;
                const available = item.stockQuantity - item.reservedQuantity;
                const specs = item.specs as Record<string, any> ?? {};
                return (
                  <div
                    key={item.id}
                    onClick={() => available > 0 && handleSelect(currentCategory, item)}
                    className={`border-2 rounded-2xl p-6 relative overflow-hidden transition-all group
                      ${available <= 0 ? 'opacity-50 cursor-not-allowed border-border' :
                        isSelected ? 'border-primary bg-primary/5 cursor-pointer hover:shadow-lg' : 'border-border cursor-pointer hover:border-primary/50 hover:shadow-md'}`}
                  >
                    {isSelected && <div className="absolute top-0 right-0 w-16 h-16 bg-primary rotate-45 translate-x-8 -translate-y-8" />}
                    {isSelected && <CheckCircle2 className="absolute top-2 right-2 text-primary-foreground h-5 w-5 z-10" />}
                    {available <= 0 && (
                      <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-black px-3 py-1 rounded-full">Sin Stock</div>
                    )}
                    <h3 className="font-bold text-lg mb-4 leading-tight pr-6">{item.name}</h3>
                    <div className="flex justify-between items-end">
                      <p className="text-2xl font-extrabold text-primary">${Number(item.price).toFixed(2)}</p>
                      <div className="flex gap-2">
                        {Object.entries(specs).slice(0, 2).map(([k, v]) => (
                          <span key={k} className="text-xs border border-muted-foreground/30 px-2 py-1 rounded-md text-muted-foreground font-medium uppercase">
                            {String(v)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 flex justify-between items-center border-t pt-8">
            <button
              onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 text-muted-foreground rounded-lg font-bold disabled:opacity-30 transition-all hover:bg-muted"
            >
              Atrás
            </button>
            <button
              onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
              disabled={!selections[currentCategory] || currentStep === steps.length - 1}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
            >
              Siguiente Paso <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="lg:w-1/3 bg-card border rounded-3xl p-8 shadow-2xl h-fit sticky top-24 flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold tracking-tight pb-4 border-b">Resumen del Ensamble</h2>
        <div className="flex flex-col gap-5">
          {steps.map(step => {
            const item = selections[step.id];
            return (
              <div key={step.id} className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{step.label}</span>
                {item ? (
                  <div className="flex justify-between items-center bg-muted/40 p-3 rounded-lg border border-border/50">
                    <span className="font-bold text-sm truncate flex-1" title={item.name}>{item.name}</span>
                    <span className="font-extrabold text-primary text-sm ml-4">${Number(item.price).toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="bg-muted/20 border border-dashed border-muted-foreground/30 p-3 rounded-lg">
                    <span className="text-muted-foreground/50 text-sm font-medium">Pendiente...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="border-t pt-6 mt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-muted-foreground">Total Estimado</span>
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">${total.toFixed(2)}</span>
          </div>
          <button
            disabled={!allSelected}
            className="w-full py-5 bg-green-500 text-white rounded-2xl font-black uppercase tracking-wider shadow-lg hover:bg-green-600 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <ShoppingCart className="h-6 w-6" />
            Añadir Ensamble al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
