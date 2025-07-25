'use server';

import { createClient } from '@/utils/supabase/server';

export type ScheduleState =
  | { success: true; error?: undefined }
  | { success?: false; error: string };

export async function createActivity({
  name,
  email,
  available_days,
}: {
  name: string;
  email: string;
  available_days: Record<string, string[]>;
}): Promise<ScheduleState> {
  const supabase = await createClient();

  const { error } = await supabase.from('professionals').insert({
    name,
    email,
    available_days,
  });

  if (error) {
    return { error: 'Erro ao criar disponibilidade. Tente novamente.' };
  }

  return { success: true };
}
