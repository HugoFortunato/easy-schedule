'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export type ChangePasswordState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const supabase = await createClient();

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Verificar se o usuário está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'Usuário não autenticado',
    };
  }

  // Validar se as senhas novas coincidem
  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: 'As senhas não coincidem.',
    };
  }

  // Validar tamanho mínimo
  if (newPassword.length < 6) {
    return {
      success: false,
      error: 'A senha deve ter no mínimo 6 caracteres.',
    };
  }

  // Verificar senha atual tentando fazer login
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return {
      success: false,
      error: 'Senha atual incorreta.',
    };
  }

  // Atualizar para nova senha
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
    };
  }

  redirect('/dashboard?success=password_changed');
}
