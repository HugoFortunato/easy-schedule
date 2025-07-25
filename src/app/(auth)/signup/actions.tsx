/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function signup(
  _prevState: any,
  formData: FormData
): Promise<any> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const userName = formData.get('username') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: userName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/signin');
}
