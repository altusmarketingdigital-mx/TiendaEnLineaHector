import BuilderRulesAdmin from '@/components/admin/builder-rules-admin';
import { db } from '@/lib/db';
import { hardwareCompatibility } from '@/db/schema';

export const metadata = { title: 'Reglas de Compatibilidad - Admin' };

export default async function BuilderRulesPage() {
  const rules = await db.select().from(hardwareCompatibility);
  return <BuilderRulesAdmin rules={rules} />;
}
