'use server';

import { createClient } from '@/utils/supabase/server';

export type ForgotPasswordState = {
  success: boolean;
  isLoading: boolean;
  message?: string;
  error?: string;
};

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://easy-schedule-beta.vercel.app';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      error: error.message,
      isLoading: false,
    };
  }

  return {
    success: true,
    isLoading: false,
    message: 'Verifique seu e-mail para o link de redefinição de senha.',
  };
}
