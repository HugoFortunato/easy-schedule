'use server';

import { createClient } from '@/utils/supabase/server';

export type ForgotPasswordState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Verifique seu e-mail para o link de redefinição de senha.',
  };
}
