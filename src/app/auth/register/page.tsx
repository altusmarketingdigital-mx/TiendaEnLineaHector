"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Monitor, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { registerUser } from '@/lib/actions/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const result = await registerUser(form.name, form.email, form.password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        setError(result.error ?? 'Error al registrar. Intenta de nuevo.');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
              <Monitor className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Crear Cuenta</h1>
          <p className="mt-2 text-muted-foreground">Únete a la comunidad TECH.STORE</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm font-medium">
            <AlertCircle className="h-5 w-5 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 text-sm font-medium">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> ¡Cuenta creada! Redirigiendo al login...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold">Nombre Completo</label>
            <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Juan Pérez" className="w-full px-5 py-4 bg-card border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-base" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="tu@email.com" className="w-full px-5 py-4 bg-card border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-base" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Contraseña</label>
            <input type="password" required minLength={8} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Mínimo 8 caracteres" className="w-full px-5 py-4 bg-card border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-base" />
          </div>
          <button type="submit" disabled={isPending || success}
            className="w-full py-4 bg-accent text-accent-foreground rounded-2xl font-black text-lg shadow-lg shadow-accent/30 hover:bg-accent/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-3">
            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {isPending ? 'Registrando...' : 'Crear Mi Cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <a href="/auth/login" className="font-bold text-primary hover:underline">Inicia Sesión</a>
        </p>
      </div>
    </div>
  );
}
