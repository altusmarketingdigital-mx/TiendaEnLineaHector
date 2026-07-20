import React from 'react';
import { Truck, ShieldCheck, CreditCard, Clock } from 'lucide-react';

const props = [
  { icon: Truck, title: 'Envíos Rápidos', desc: 'A todo el país con las mejores paqueterías.' },
  { icon: ShieldCheck, title: 'Compras Seguras', desc: 'Tu información está encriptada y protegida.' },
  { icon: CreditCard, title: 'Múltiples Pagos', desc: 'Tarjetas, transferencias y pagos en efectivo.' },
  { icon: Clock, title: 'Atención 24/7', desc: 'Soporte técnico y asistencia en tus compras.' }
];

export default function ValueProps() {
  return (
    <div className="mb-12 bg-white border border-border rounded-sm p-8 shadow-sm">
      <h2 className="text-2xl font-extrabold text-secondary mb-8 text-center">Somos tu mejor opción</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {props.map((prop, idx) => {
          const Icon = prop.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Icon className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-foreground">{prop.title}</h4>
              <p className="text-sm text-muted-foreground">{prop.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
