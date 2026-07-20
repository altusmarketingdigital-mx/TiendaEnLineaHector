import ShipmentsAdmin from '@/components/admin/shipments-admin';
import { getShipments } from '@/lib/actions/shipments';

export const metadata = { title: 'Control de Envíos - Admin' };

export default async function ShipmentsPage() {
  const shipments = await getShipments();
  return <ShipmentsAdmin shipments={shipments} />;
}
