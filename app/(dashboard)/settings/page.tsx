import { SettingsPageContent } from '@/components/settings/settings-page';
import { requireRole } from '@/lib/auth-helpers';

export default async function SettingsPage() {
  await requireRole(['ADMIN']);
  return <SettingsPageContent />;
}
