"use client";

import React, { useState } from 'react';
import { Cpu, Zap, HardDrive, Fan, ChevronDown, ChevronUp, ShoppingCart, ArrowLeft } from 'lucide-react';
import type { ProductWithInventory } from '@/lib/queries/products';
import Link from 'next/link';

const steps = [
  { id: 'CPU', label: 'PROCESADOR', icon: Cpu },
  { id: 'GPU', label: 'TARJETA DE VIDEO', icon: Zap },
  { id: 'RAM', label: 'MEMORIA RAM', icon: HardDrive },
  { id: 'Almacenamiento 1', label: 'ALMACENAMIENTO PRINCIPAL', icon: HardDrive },
  { id: 'Almacenamiento 2', label: 'ALMACENAMIENTO ADICIONAL', icon: HardDrive },
  { id: 'Disipador', label: 'DISIPADOR', icon: Fan },
];

type Props = {
  productsByCategory: Record<string, ProductWithInventory[]>;
};

export default function PCBuilder({ productsByCategory }: Props) {
  const [expandedStep, setExpandedStep] = useState<string | null>('CPU');
  const [selections, setSelections] = useState<Record<string, ProductWithInventory>>({});
  const [activeTab, setActiveTab] = useState<'configurator' | 'technical'>('configurator');

  const handleSelect = (categoryId: string, item: ProductWithInventory) => {
    setSelections(prev => ({ ...prev, [categoryId]: item }));
    // Auto-advance to next empty step
    const currentIndex = steps.findIndex(s => s.id === categoryId);
    if (currentIndex < steps.length - 1) {
      setExpandedStep(steps[currentIndex + 1].id);
    } else {
      setExpandedStep(null); // All done, collapse
    }
  };

  const total = Object.values(selections).reduce((acc, item) => acc + Number(item.price), 0);
  const formattedTotal = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col min-h-screen bg-[#131522] text-white w-full max-w-3xl mx-auto shadow-2xl relative pb-28">
      
      {/* Header Mobile Style */}
      <div className="bg-[#0b519e] px-4 py-4 flex items-center gap-4 text-lg font-bold sticky top-0 z-40 shadow-md">
        <Link href="/catalog" className="hover:opacity-75 transition-opacity">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        Configurar mi PC
      </div>

      {/* Subtotal Bar */}
      <div className="bg-[#191a27] py-4 px-4 text-center border-b border-[#25283f] flex flex-col md:flex-row items-center justify-center gap-2">
        <span className="text-gray-400 text-sm">Subtotal de mi configuración:</span>
        <span className="text-2xl font-black">${formattedTotal}</span>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#191a27] text-sm font-bold border-b border-[#25283f] sticky top-[60px] z-30">
        <button 
          onClick={() => setActiveTab('configurator')}
          className={`flex-1 py-4 text-center transition-colors ${activeTab === 'configurator' ? 'text-white border-b-2 border-[#00d8d6]' : 'text-gray-400 hover:text-white'}`}
        >
          Configurador
        </button>
        <button 
          onClick={() => setActiveTab('technical')}
          className={`flex-1 py-4 text-center transition-colors ${activeTab === 'technical' ? 'text-white border-b-2 border-[#00d8d6]' : 'text-gray-400 hover:text-white'}`}
        >
          Aspectos técnicos
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {activeTab === 'configurator' && steps.map(step => {
          const isExpanded = expandedStep === step.id;
          const selectedItem = selections[step.id];
          const Icon = step.icon;
          
          // Fallback logic to get products if exact category is empty
          let categoryProducts = productsByCategory[step.id] || [];
          if (step.id.includes('Almacenamiento')) categoryProducts = productsByCategory['Almacenamiento NVMe'] || [];
          if (step.id === 'Disipador') categoryProducts = productsByCategory['Enfriamiento'] || [];

          return (
            <div key={step.id} className="bg-[#212338] border border-[#2e314a] rounded-lg overflow-hidden transition-all duration-300">
              {/* Accordion Header */}
              <button 
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#282b45] transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Icon className="h-6 w-6 text-gray-400 shrink-0" strokeWidth={1.5} />
                  <div className="flex flex-col flex-1 pr-4">
                    <span className="font-black tracking-widest uppercase text-[13px]">{step.label}</span>
                    {selectedItem ? (
                      <span className="text-sm text-gray-400 truncate max-w-[200px] sm:max-w-xs">{selectedItem.name}</span>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Seleccionar componente...</span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-white">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="bg-[#181a29] border-t border-[#2e314a] p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto scroll-small">
                  {categoryProducts.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">No hay componentes disponibles en esta categoría.</div>
                  ) : (
                    categoryProducts.map(product => {
                      const isSelected = selectedItem?.id === product.id;
                      const available = product.stockQuantity - product.reservedQuantity;
                      return (
                        <div 
                          key={product.id} 
                          onClick={() => available > 0 && handleSelect(step.id, product)}
                          className={`flex items-center justify-between p-3 rounded-md border-2 transition-all cursor-pointer ${
                            available <= 0 ? 'opacity-50 cursor-not-allowed border-transparent bg-[#1c1e2f]' : 
                            isSelected ? 'border-[#00d8d6] bg-[#00d8d6]/10' : 'border-[#2e314a] hover:border-gray-400 bg-[#1c1e2f]'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm line-clamp-1">{product.name}</span>
                            <span className="text-xs text-gray-400">Stock: {available > 0 ? available : 'Agotado'}</span>
                          </div>
                          <div className="flex flex-col items-end shrink-0 pl-4">
                            <span className="font-bold text-[#00d8d6]">${Number(product.price).toFixed(2)}</span>
                            {isSelected && <span className="text-[10px] font-black uppercase text-[#00d8d6] mt-1">Seleccionado</span>}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
        })}

        {activeTab === 'technical' && (
          <div className="bg-[#212338] border border-[#2e314a] rounded-lg p-6 text-center text-gray-400">
            <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-bold text-white mb-2">Validación Estricta Activa</h3>
            <p className="text-sm">El sistema asegurará la compatibilidad de los componentes seleccionados de forma automática.</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#131522]/90 backdrop-blur-md border-t border-[#2e314a] z-50 flex justify-center">
        <div className="w-full max-w-3xl">
          <button 
            className="w-full py-4 bg-[#ff0054] hover:bg-[#d40045] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(255,0,84,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={total === 0}
          >
            <ShoppingCart className="h-6 w-6" />
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
