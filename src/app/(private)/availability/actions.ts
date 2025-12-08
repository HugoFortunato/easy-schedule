'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteTimeSlot(
  date: string,
  time: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Usuário não autenticado' };
  }

  const { data: professional } = await supabase
    .from('professionals')
    .select('*')
    .eq('email', user.email)
    .single();

  if (!professional) {
    return { success: false, error: 'Profissional não encontrado' };
  }

  const available_days_raw = professional.available_days;

  let available_days: Record<string, string[]> = {};

  if (typeof available_days_raw === 'string') {
    try {
      available_days = JSON.parse(available_days_raw);
    } catch {
      available_days = {};
    }
  } else if (
    typeof available_days_raw === 'object' &&
    available_days_raw !== null
  ) {
    available_days = available_days_raw as Record<string, string[]>;
  }

  const available_hours = available_days[date] || [];

  const updated_hours = available_hours.filter((t: string) => t !== time);

  const updatedDays = { ...available_days };
  if (updated_hours.length === 0) {
    delete updatedDays[date];
  } else {
    updatedDays[date] = updated_hours;
  }

  const { error } = await supabase
    .from('professionals')
    .update({ available_days: updatedDays })
    .eq('id', professional.id);

  if (error) {
    return { success: false, error: 'Erro ao atualizar disponibilidade' };
  }

  revalidatePath('/availability');
  revalidatePath('/dashboard');

  return { success: true };
}

export async function updateTimeSlot(
  date: string,
  oldTime: string,
  newTime: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Usuário não autenticado' };
  }

  const { data: professional } = await supabase
    .from('professionals')
    .select('*')
    .eq('email', user.email)
    .single();

  if (!professional) {
    return { success: false, error: 'Profissional não encontrado' };
  }

  const available_days_raw = professional.available_days;

  let available_days: Record<string, string[]> = {};

  if (typeof available_days_raw === 'string') {
    try {
      available_days = JSON.parse(available_days_raw);
    } catch {
      available_days = {};
    }
  } else if (
    typeof available_days_raw === 'object' &&
    available_days_raw !== null
  ) {
    available_days = available_days_raw as Record<string, string[]>;
  }

  if (available_days[date]) {
    const index = available_days[date].indexOf(oldTime);
    if (index !== -1) {
      available_days[date][index] = newTime;
    }
  }

  const { error } = await supabase
    .from('professionals')
    .update({ available_days })
    .eq('id', professional.id);

  if (error) {
    return { success: false, error: 'Erro ao atualizar disponibilidade' };
  }

  revalidatePath('/availability');
  revalidatePath('/dashboard');

  return { success: true };
}
