'use server';

import { createClient } from '@/utils/supabase/server';

export type UpdateAppointmentState =
  | { success: true; error?: undefined }
  | { success?: false; error: string };

export async function updateAppointment(
  appointmentId: string,
  newTime: string
): Promise<UpdateAppointmentState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Usuário não autenticado' };
  }

  const { data: appointment, error: fetchError } = await supabase
    .from('appointments')
    .select('professional_id')
    .eq('id', appointmentId)
    .single();

  if (fetchError || !appointment) {
    return { error: 'Agendamento não encontrado' };
  }

  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!professional || professional.id !== appointment.professional_id) {
    return { error: 'Você não tem permissão para editar este agendamento' };
  }

  const { error: updateError } = await supabase
    .from('appointments')
    .update({ time: newTime })
    .eq('id', appointmentId);

  if (updateError) {
    return { error: 'Erro ao atualizar agendamento. Tente novamente.' };
  }

  return { success: true };
}
