import UserInfo from '@/components/user-info';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/signin');
  }

  return (
    <div className="p-10">
      <UserInfo loggedUser={{ email: data.user.email }} />
    </div>
  );
}
