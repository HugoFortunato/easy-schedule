'use server';

import { createClient } from '@/utils/supabase/server';

export type ScheduleState =
  | { success: true; error?: undefined; whatsappUrl?: string }
  | { success?: false; error: string };

export async function doSchedule(
  _prevState: ScheduleState,
  formData: FormData
): Promise<ScheduleState> {
  const supabase = await createClient();

  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const client_name = formData.get('client_name') as string;
  const client_phone = formData.get('client_phone') as string;
  const professional_id = formData.get('professional_id') as string;
  const reason = formData.get('reason') as string;

  if (!client_name || !date || !time) {
    return { error: 'Campos obrigatórios não preenchidos.' };
  }

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('professional_id', professional_id);

  const appointmentDay = data?.map((ap) => ap.date);
  const appointmentTime = data?.map((ap) => ap.time);

  if (appointmentDay?.includes(date) && appointmentTime?.includes(time)) {
    return { error: 'Data indisponível. Por favor, escolha outra data.' };
  }

  const { error } = await supabase.from('appointments').insert({
    professional_id,
    client_name,
    client_phone,
    date,
    time,
    reason,
  });

  if (error) {
    return { error: 'Erro ao agendar. Tente novamente.' };
  }

  // Formata a data para exibição (dd/MM)
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const formattedDate = `${day}/${month}`;

  // Monta a mensagem para WhatsApp
  const message = `Olá! Estou agendando meu horário para o dia ${formattedDate} às ${time}.${reason ? ` Motivo: ${reason}` : ''}`;

  // Número do profissional (sem espaços e caracteres especiais)
  const professionalPhone = '5511989333434';

  // Cria URL do WhatsApp
  const whatsappUrl = `https://wa.me/${professionalPhone}?text=${encodeURIComponent(message)}`;

  return { success: true, whatsappUrl };
}
