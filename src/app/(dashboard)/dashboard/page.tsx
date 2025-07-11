import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies: () => cookies() });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Usuário logado: {session?.user?.email}</p>
    </div>
  );
}
