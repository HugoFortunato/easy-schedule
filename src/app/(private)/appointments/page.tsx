import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

import AppointmentsContent from '@/components/appointments-content';
import { deleteAllAppointments } from './actions';

export default async function Appointments() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const name = data?.user?.user_metadata?.username;

  if (error || !data?.user) {
    redirect('/signin');
  }

  const { data: userInfo } = await supabase
    .from('professionals')
    .select('*')
    .eq('name', name)
    .single();

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('professional_id', userInfo?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppointmentsContent
        appointments={appointments as []}
        deleteAllAppointments={deleteAllAppointments}
      />
    </div>
  );
}
