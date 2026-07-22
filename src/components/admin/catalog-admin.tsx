"use client";

import React, { useState, useTransition } from 'react';
import { Plus, Trash2, Package, Loader2, CheckCircle2, AlertCircle, Upload, FileSpreadsheet } from 'lucide-react';
import { createProduct, deleteProduct, type CreateProductInput } from '@/lib/actions/admin';

type Product = {
  id: number;
  name: string;
  price: string;
  specs: Record<string, unknown> | null;
  stockQuantity: number;
};

type Props = { products: Product[] };

const SPEC_TEMPLATES: Record<string, Record<string, string>> = {
  CPU: { category: 'CPU', socket: 'AM5', cores: '16', threads: '32', baseClock: '3.2GHz', tdp: '170W' },
  GPU: { category: 'GPU', vram: '24GB', memType: 'GDDR6X', tdp: '450W', length: '336mm' },
  Motherboard: { category: 'Motherboard', socket: 'AM5', formFactor: 'ATX', ddrSupport: 'DDR5', pcie: 'x16' },
  RAM: { category: 'RAM', type: 'DDR5', speed: '6000MHz', capacity: '32GB', cas: 'CL30' },
  Storage: { category: 'Storage', type: 'NVMe M.2', capacity: '2TB', readSpeed: '7450MB/s' },
  PSU: { category: 'PSU', wattage: '1000W', rating: '80+ Gold', modular: 'Full' },
};

export default function CatalogAdmin({ products: initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', initialStock: '0',
    category: 'GPU',
    specs: JSON.stringify(SPEC_TEMPLATES['GPU'], null, 2),
    images: '',
  });

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCategoryChange = (cat: string) => {
    setForm(p => ({ ...p, category: cat, specs: JSON.stringify(SPEC_TEMPLATES[cat] ?? {}, null, 2) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedSpecs: Record<string, unknown> = {};
    try { parsedSpecs = JSON.parse(form.specs); } catch {
      showToast('error', 'Las especificaciones (JSON) no tienen formato válido.'); return;
    }
    startTransition(async () => {
      const input: CreateProductInput = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: form.description,
        price: Number(form.price),
        specs: parsedSpecs,
        images: form.images ? form.images.split('\n').filter(Boolean) : [],
        initialStock: Number(form.initialStock),
      };
      const result = await createProduct(input);
      if (result.success) {
        showToast('success', `✅ Producto "${form.name}" creado exitosamente.`);
        setShowForm(false);
        setForm({ name: '', slug: '', description: '', price: '', initialStock: '0', category: 'GPU', specs: JSON.stringify(SPEC_TEMPLATES['GPU'], null, 2), images: '' });
      } else {
        showToast('error', 'Error al crear el producto.');
      }
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deleteProduct(id);
      setProducts(p => p.filter(x => x.id !== id));
      showToast('success', `Producto eliminado.`);
    });
  };

  const handleCsvImport = async () => {
    if (!csvFile) return;
    setCsvLoading(true);
    const fd = new FormData();
    fd.append('file', csvFile);
    try {
      const res = await fetch('/api/catalog/import', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        showToast('success', data.message);
        setShowCsvModal(false);
        setCsvFile(null);
        // Reload page to refresh product list
        window.location.reload();
      } else {
        showToast('error', data.error ?? 'Error al importar CSV.');
      }
    } catch {
      showToast('error', 'No se pudo conectar con el servidor.');
    } finally {
      setCsvLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold
          ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-destructive text-destructive-foreground'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Gestión de Catálogo</h2>
          <p className="text-muted-foreground mt-1">{products.length} productos en la base de datos</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-2 px-5 py-3 border-2 border-primary text-primary rounded-2xl font-bold hover:bg-primary/10 hover:scale-105 active:scale-95 transition-all">
            <FileSpreadsheet className="h-5 w-5" /> Importar CSV
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all">
            <Plus className="h-5 w-5" /> Agregar Producto
          </button>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-3xl p-8 w-full max-w-md shadow-2xl flex flex-col gap-6">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">Importar Productos CSV</h3>
              <p className="text-sm text-muted-foreground mt-1">El archivo debe tener los encabezados:<br/><code className="text-xs bg-muted px-2 py-1 rounded">name, slug, price, categoryName, stockQuantity, description, images</code></p>
              <p className="text-xs text-muted-foreground mt-2">Separa múltiples imágenes con <code>|</code></p>
            </div>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary/40 rounded-2xl p-8 cursor-pointer hover:border-primary transition-colors gap-3">
              <Upload className="h-8 w-8 text-primary/60" />
              <span className="text-sm font-semibold">{csvFile ? csvFile.name : 'Haz clic para seleccionar un archivo .csv'}</span>
              <input type="file" accept=".csv" className="hidden" onChange={e => setCsvFile(e.target.files?.[0] ?? null)} />
            </label>
            <div className="flex gap-3">
              <button onClick={() => { setShowCsvModal(false); setCsvFile(null); }}
                className="flex-1 px-4 py-3 border rounded-2xl font-bold hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button onClick={handleCsvImport} disabled={!csvFile || csvLoading}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {csvLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {csvLoading ? 'Importando...' : 'Importar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-3xl p-8 shadow-sm flex flex-col gap-6">
          <h3 className="text-2xl font-extrabold tracking-tight pb-4 border-b">Nuevo Producto</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Nombre del Producto *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="NVIDIA RTX 5090 OC" className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Precio (MXN) *</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                placeholder="1999.99" className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Categoría de Componente *</label>
              <select value={form.category} onChange={e => handleCategoryChange(e.target.value)}
                className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all">
                {Object.keys(SPEC_TEMPLATES).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Stock Inicial *</label>
              <input required type="number" value={form.initialStock} onChange={e => setForm(p => ({ ...p, initialStock: e.target.value }))}
                placeholder="10" className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Descripción</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3} placeholder="Descripción técnica del componente..."
              className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all resize-y" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">Especificaciones Técnicas (JSON) *</label>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-mono">JSONB → Neon</span>
            </div>
            <textarea required value={form.specs} onChange={e => setForm(p => ({ ...p, specs: e.target.value }))}
              rows={8} spellCheck={false}
              className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all resize-y font-mono text-sm" />
            <p className="text-xs text-muted-foreground">La plantilla se auto-rellena según la categoría seleccionada. Puedes agregar o modificar cualquier campo.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">URLs de Imágenes (una por línea)</label>
            <textarea value={form.images} onChange={e => setForm(p => ({ ...p, images: e.target.value }))}
              rows={3} placeholder="https://cdn.example.com/rtx5090-front.jpg&#10;https://cdn.example.com/rtx5090-back.jpg"
              className="px-5 py-3 bg-background border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all resize-y" />
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-2xl font-bold text-muted-foreground hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isPending}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 flex items-center gap-2">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              {isPending ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      )}

      {/* Product List */}
      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              <th className="text-left p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Producto</th>
              <th className="text-left p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Categoría</th>
              <th className="text-right p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Precio</th>
              <th className="text-right p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Stock</th>
              <th className="text-right p-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Sin productos. Agrega el primero.</p>
                </td>
              </tr>
            ) : products.map(p => (
              <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-5">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">ID: {p.id}</p>
                </td>
                <td className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider bg-muted px-3 py-1.5 rounded-full">
                    {(p.specs as any)?.category ?? '—'}
                  </span>
                </td>
                <td className="p-5 text-right font-bold">${Number(p.price).toFixed(2)}</td>
                <td className="p-5 text-right">
                  <span className={`font-bold ${p.stockQuantity <= 0 ? 'text-destructive' : p.stockQuantity <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {p.stockQuantity}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => handleDelete(p.id, p.name)} disabled={isPending}
                    className="p-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-colors disabled:opacity-50">
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
