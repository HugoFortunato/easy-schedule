'use server';

import { createClient } from '@/utils/supabase/server';

export type ScheduleState =
  | { success: true; error?: undefined }
  | { success?: false; error: string };

export async function doSchedule(
  _prevState: ScheduleState,
  formData: FormData
): Promise<ScheduleState> {
  const supabase = await createClient();

  const date = formData.get('date');
  const time = formData.get('time');

  const client_name = formData.get('client_name');
  const client_phone = formData.get('client_phone');
  const professional_id = formData.get('professional_id');

  if (!client_name || !date || !time) {
    return { error: 'Campos obrigatórios não preenchidos.' };
  }

  const { error } = await supabase.from('appointments').insert({
    professional_id,
    client_name,
    client_phone,
    date,
    time,
  });

  if (error) {
    return { error: 'Erro ao agendar. Tente novamente.' };
  }

  return { success: true };
}
