import React from 'react';
import Link from 'next/link';
import { UserCircle, Truck, PackageCheck, SlidersHorizontal, Heart } from 'lucide-react';

export default function LoginCTA() {
  const benefits = [
    { icon: Truck, title: "Envío Rápido", desc: "Recibe tus productos de tecnología directamente en tu puerta, de forma rápida y segura." },
    { icon: PackageCheck, title: "Rastreo Exacto", desc: "Mantente informado sobre el estado de tus compras en todo momento, desde el momento de la orden hasta la entrega." },
    { icon: SlidersHorizontal, title: "Personalización", desc: "Disfruta de una compra adaptada a tus preferencias y necesidades, brindándote recomendaciones y sugerencias relevantes." },
    { icon: Heart, title: "Lista de Deseos", desc: "Guarda tus productos favoritos en una lista de deseos para comprarlos más adelante o compartirlos con tus amigos y familiares." }
  ];

  return (
    <div className="mb-12">
      {/* Main Banner */}
      <div className="w-full bg-white border border-border rounded-sm p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <UserCircle className="w-12 h-12 text-[#ff7a00]" />
          <div>
            <h3 className="text-xl font-bold text-secondary">¿Ya tienes cuenta?</h3>
            <p className="text-sm text-muted-foreground">Inicia sesión para ver tu historial de pedidos y guardar productos favoritos.</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Link href="/auth/login" className="flex-1 md:flex-none px-6 py-2 border-2 border-[#ff7a00] text-[#ff7a00] font-bold rounded-sm text-center hover:bg-[#ff7a00]/5 transition-colors">
            Inicia Sesión
          </Link>
          <Link href="/auth/register" className="flex-1 md:flex-none px-6 py-2 bg-[#ff7a00] text-white font-bold rounded-sm text-center hover:bg-[#e66e00] transition-colors shadow-sm">
            Regístrate
          </Link>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white border border-border p-8 rounded-sm shadow-sm">
        <h3 className="text-center text-2xl font-bold text-secondary mb-8">Regístrate y abre la puerta al mundo de la tecnología.</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#ff7a00]/10 flex items-center justify-center text-[#ff7a00]">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
