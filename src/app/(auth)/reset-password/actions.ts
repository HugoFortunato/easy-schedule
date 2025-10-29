'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export type ResetPasswordState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const supabase = await createClient();

  // Verifica se há uma sessão válida
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message:
        'Sessão inválida. Por favor, solicite um novo link de recuperação.',
      error:
        'Sessão inválida. Por favor, solicite um novo link de recuperação.',
    };
  }

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return {
      success: false,
      message: 'As senhas não coincidem.',
      error: 'As senhas não coincidem.',
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: 'A senha deve ter no mínimo 6 caracteres.',
      error: 'A senha deve ter no mínimo 6 caracteres.',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      error: error.message,
    };
  }

  redirect('/signin?success=password_reset');
}
