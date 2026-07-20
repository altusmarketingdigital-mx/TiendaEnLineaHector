"use client";

import React, { useState, useTransition } from 'react';
import { Plus, Users, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createCustomer } from '@/lib/actions/admin';

type Customer = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

type Props = { customers: Customer[] };

export default function CustomersAdmin({ customers: initialCustomers }: Props) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createCustomer(form);
      if (result.success) {
        showToast('success', `✅ Cliente creado. Contraseña asignada: ${result.defaultPassword}`);
        setShowForm(false);
        // Refresh handled by revalidatePath from server action
        setForm({ name: '', email: '', password: '' });
      } else {
        showToast('error', result.error || 'Error al crear cliente');
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold
          ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-destructive text-destructive-foreground'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Gestión de Clientes</h2>
          <p className="text-muted-foreground mt-1">{customers.length} clientes registrados</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all">
          <Plus className="h-5 w-5" /> Registrar Cliente
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-3xl p-8 shadow-sm flex flex-col gap-6">
          <h3 className="text-2xl font-extrabold tracking-tight pb-4 border-b">Nuevo Registro de Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Nombre Completo *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Juan Pérez" className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Correo Electrónico *</label>
              <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="juan@ejemplo.com" className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold">Contraseña (Opcional)</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Deja en blanco para auto-generar 'cliente123'" className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>
          <div className="flex gap-4 justify-end pt-4 border-t">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-2xl font-bold text-muted-foreground hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isPending}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 flex items-center gap-2">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              {isPending ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              <th className="text-left p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">ID</th>
              <th className="text-left p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Cliente</th>
              <th className="text-left p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Correo</th>
              <th className="text-right p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Fecha de Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Sin clientes registrados.</p>
                </td>
              </tr>
            ) : customers.map(c => (
              <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-5 text-muted-foreground font-mono text-xs">{c.id}</td>
                <td className="p-5 font-semibold">{c.name}</td>
                <td className="p-5">{c.email}</td>
                <td className="p-5 text-right text-muted-foreground text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
