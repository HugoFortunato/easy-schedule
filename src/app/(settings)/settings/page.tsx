import SettingsForm, { SupabaseUserResponse } from '@/components/settings-form';
import { createClient } from '@/utils/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  return <SettingsForm professionalData={data as SupabaseUserResponse} />;
}
