import React from 'react';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';

export default function LoginCTA() {
  return (
    <div className="w-full bg-white border border-border rounded-sm p-6 mb-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <UserCircle className="w-12 h-12 text-primary" />
        <div>
          <h3 className="text-xl font-bold text-secondary">¿Ya tienes cuenta?</h3>
          <p className="text-sm text-muted-foreground">Inicia sesión para ver tu historial de pedidos y guardar productos favoritos.</p>
        </div>
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <Link href="/auth/login" className="flex-1 md:flex-none px-6 py-2 border-2 border-primary text-primary font-bold rounded-sm text-center hover:bg-primary/5 transition-colors">
          Inicia Sesión
        </Link>
        <Link href="/auth/register" className="flex-1 md:flex-none px-6 py-2 bg-primary text-white font-bold rounded-sm text-center hover:bg-primary/90 transition-colors shadow-sm">
          Regístrate
        </Link>
      </div>
    </div>
  );
}
