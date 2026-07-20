import React from 'react';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="h-24 w-24 rounded-3xl bg-destructive/10 flex items-center justify-center">
          <ShieldX className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Acceso Denegado</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          No tienes los permisos necesarios para acceder a esta sección.
          Contacta a un Administrador si crees que esto es un error.
        </p>
        <a href="/" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg">
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}
