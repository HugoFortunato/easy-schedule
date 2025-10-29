import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // Troca o code por uma sessão válida
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Erro ao trocar code por sessão:', error);
      return NextResponse.redirect(`${origin}/signin?error=auth_error`);
    }

    // Redireciona para a página de reset de senha com sessão válida
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  // Se não houver code, redireciona para signin
  return NextResponse.redirect(`${origin}/signin`);
}
