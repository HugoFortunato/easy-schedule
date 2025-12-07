'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { SignInState } from '@/types/initialState';

export async function signin(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
