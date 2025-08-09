'use server';

import { createClient } from '@/utils/supabase/server';

type AvailableDays = Record<string, string[]>;

interface UserData {
  created_at: string; // ou Date se quiser converter
  id: string;
  name: string;
  email: string;
  available_days: AvailableDays;
}

export type ScheduleState =
  | { success: true; error?: undefined; data: UserData }
  | { success?: false; error: string; data?: UserData };

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

  const { error, data } = await supabase
    .from('professionals')
    .insert({
      name,
      email,
      available_days,
    })
    .select();

  if (error) {
    return { error: 'Erro ao criar disponibilidade. Tente novamente.' };
  }

  return { success: true, data: data[0] };
}
