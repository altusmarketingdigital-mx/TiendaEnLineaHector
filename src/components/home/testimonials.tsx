import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  { name: 'Carlos M.', text: 'Excelente servicio, mi PC llegó armada a la perfección y con excelente cableado.', date: 'Hace 2 días' },
  { name: 'Laura G.', text: 'Encontré la tarjeta de video que buscaba a un súper precio. El envío rapidísimo.', date: 'Hace 1 semana' },
  { name: 'Roberto S.', text: 'El armador de PC es una joya. Me ayudó a evitar cuellos de botella.', date: 'Hace 3 semanas' },
  { name: 'Diana V.', text: 'Atención al cliente de 10. Tuve dudas con mi fuente de poder y me asesoraron rápido.', date: 'Hace 1 mes' }
];

export default function Testimonials() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-extrabold text-secondary mb-6 border-b border-border pb-2">Opiniones de nuestros clientes</h2>
      <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scroll-small -mx-4 px-4 md:mx-0 md:px-0">
        {reviews.map((rev, idx) => (
          <div key={idx} className="min-w-[300px] max-w-[300px] snap-start shrink-0 bg-white border border-border p-6 rounded-sm shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-4 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-foreground mb-4 italic">&ldquo;{rev.text}&rdquo;</p>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border pt-4 mt-auto">
              <span className="font-bold">{rev.name}</span>
              <span>{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
