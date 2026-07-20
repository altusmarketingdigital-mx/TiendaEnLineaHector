"use client";

import React, { useState, useTransition } from 'react';
import { Plus, Trash2, Cpu, Monitor, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createCompatibilityRule, deleteCompatibilityRule } from '@/lib/actions/admin';

type CompatibilityRule = {
  id: number;
  componentTypeA: string;
  componentTypeB: string;
  compatibilityRule: any;
};

type Props = { rules: CompatibilityRule[] };

const COMPONENT_TYPES = ['CPU', 'Motherboard', 'RAM', 'GPU', 'PSU', 'Storage', 'Cooler', 'Case'];

export default function BuilderRulesAdmin({ rules: initialRules }: Props) {
  const [rules, setRules] = useState(initialRules);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [form, setForm] = useState({
    componentTypeA: 'CPU',
    componentTypeB: 'Motherboard',
    ruleKey: 'socket',
    ruleValue: 'AM5',
  });

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const rule = { [form.ruleKey]: form.ruleValue };
      const result = await createCompatibilityRule(form.componentTypeA, form.componentTypeB, rule);
      if (result.success) {
        showToast('success', `✅ Regla de compatibilidad creada: ${form.componentTypeA} ↔ ${form.componentTypeB} [${form.ruleKey}: ${form.ruleValue}]`);
      }
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteCompatibilityRule(id);
      setRules(r => r.filter(x => x.id !== id));
      showToast('success', 'Regla eliminada.');
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold
          ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-destructive text-destructive-foreground'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {toast.msg}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Cpu className="h-8 w-8 text-primary" /> Reglas de Compatibilidad del PC Builder
        </h2>
        <p className="text-muted-foreground mt-2">Define qué componentes son compatibles entre sí. El PC Builder aplica estas reglas automáticamente en tiempo real.</p>
      </div>

      {/* Add Rule Form */}
      <form onSubmit={handleAdd} className="bg-card border rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-extrabold mb-6 pb-4 border-b">Agregar Nueva Regla</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Componente A</label>
            <select value={form.componentTypeA} onChange={e => setForm(p => ({ ...p, componentTypeA: e.target.value }))}
              className="px-4 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold">
              {COMPONENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Componente B</label>
            <select value={form.componentTypeB} onChange={e => setForm(p => ({ ...p, componentTypeB: e.target.value }))}
              className="px-4 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold">
              {COMPONENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Atributo (ej: socket)</label>
            <input value={form.ruleKey} onChange={e => setForm(p => ({ ...p, ruleKey: e.target.value }))}
              placeholder="socket" className="px-4 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold font-mono" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Valor (ej: AM5)</label>
            <input value={form.ruleValue} onChange={e => setForm(p => ({ ...p, ruleValue: e.target.value }))}
              placeholder="AM5" className="px-4 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold font-mono" />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button type="submit" disabled={isPending}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-60">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Agregar Regla
          </button>
        </div>
      </form>

      {/* Rules Table */}
      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              <th className="text-left p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Componente A</th>
              <th className="text-left p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">↔</th>
              <th className="text-left p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Componente B</th>
              <th className="text-left p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Regla (JSON)</th>
              <th className="p-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rules.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  <Monitor className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Sin reglas. Agrega la primera regla de compatibilidad.</p>
                </td>
              </tr>
            ) : rules.map(rule => (
              <tr key={rule.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-5">
                  <span className="font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs uppercase">{rule.componentTypeA}</span>
                </td>
                <td className="p-5 text-muted-foreground font-black">↔</td>
                <td className="p-5">
                  <span className="font-bold bg-accent/10 text-accent px-3 py-1.5 rounded-full text-xs uppercase">{rule.componentTypeB}</span>
                </td>
                <td className="p-5 font-mono text-xs bg-muted/30">
                  {JSON.stringify(rule.compatibilityRule)}
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => handleDelete(rule.id)} disabled={isPending}
                    className="p-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
