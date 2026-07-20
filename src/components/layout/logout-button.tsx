"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutButton({ variant = "icon" }: { variant?: "icon" | "text" | "sidebar" }) {
  if (variant === "sidebar") {
    return (
      <button 
        onClick={() => signOut({ callbackUrl: '/auth/login' })}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-all hover:bg-red-500/10 text-left font-medium"
      >
        <LogOut className="h-4 w-4" />
        Cerrar Sesión
      </button>
    );
  }
  
  if (variant === "text") {
    return (
      <button 
        onClick={() => signOut({ callbackUrl: '/' })}
        className="hover:underline text-red-500 font-bold"
      >
        Cerrar Sesión
      </button>
    );
  }

  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      title="Cerrar sesión"
      className="bg-muted p-2 rounded-full hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors"
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}
