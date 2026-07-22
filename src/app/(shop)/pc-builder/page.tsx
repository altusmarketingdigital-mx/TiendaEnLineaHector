import PCBuilder from '@/components/builder/pc-builder';
import { getProducts } from '@/lib/queries/products';

export const metadata = {
  title: 'PC Builder - TECH.STORE',
};

// Server Component: fetches products, groups by category, passes to builder
export default async function PCBuilderPage() {
  const products = await getProducts({ inStockOnly: false });

  // Group products by their `specs.category` field
  const productsByCategory = products.reduce<Record<string, typeof products>>((acc, p) => {
    const cat = ((p.specs as Record<string, unknown>)?.category as string) ?? 'Otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return <PCBuilder productsByCategory={productsByCategory} />;
}
