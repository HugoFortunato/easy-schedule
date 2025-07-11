import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  url.pathname = '/signin';

  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(session, 'session');
  // ✅ Se não houver sessão, redireciona para login
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
