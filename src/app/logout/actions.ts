'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function logout() {
  const supabase = await createClient();
  const cookieStore = await cookies();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Erro ao fazer logout:', error);
  }

  cookieStore.delete('activity-token');

  // Revalidar e redirecionar
  revalidatePath('/', 'layout');
  redirect('/signin');
}
