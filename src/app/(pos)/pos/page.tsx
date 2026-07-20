import POSInterface from '@/components/pos/pos-interface';
import { getProducts } from '@/lib/queries/products';

// Server Component: fetch products from Neon, pass to client POS
export default async function POSPage() {
  const products = await getProducts({ inStockOnly: false });
  return <POSInterface products={products} />;
}
