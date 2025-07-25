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

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('professional_id', professional_id);

  const appointmentDay = data?.map((ap) => ap.date);
  const appointmentTime = data?.map((ap) => ap.time);

  console.log(date, 'date');

  if (appointmentDay?.includes(date) && appointmentTime?.includes(time)) {
    return { error: 'Data indisponível. Por favor, escolha outra data.' };
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
