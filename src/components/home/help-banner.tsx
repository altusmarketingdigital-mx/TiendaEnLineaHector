import React from 'react';
import { PhoneCall, MessageCircle } from 'lucide-react';

export default function HelpBanner() {
  return (
    <div className="w-full bg-[#1a202c] text-white rounded-sm p-8 md:p-12 mb-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <h2 className="text-3xl font-extrabold mb-2">¿Necesitas ayuda con tu compra?</h2>
        <p className="text-gray-400">Nuestros expertos están disponibles para asesorarte en la configuración de tu equipo.</p>
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-sm transition-colors shadow-sm">
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </button>
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-sm transition-colors">
          <PhoneCall className="w-5 h-5" />
          Llamar
        </button>
      </div>
    </div>
  );
}
