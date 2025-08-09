import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AppointmentsCard from '@/components/appointments-card';

export default async function Appointments() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const name = data?.user?.user_metadata?.username;

  const { data: userInfo } = await supabase
    .from('professionals')
    .select('*')
    .eq('name', name)
    .single();

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('professional_id', userInfo?.id)
    .order('date', { ascending: true });

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 w-full gap-4">
      {appointments && (
        <div className="flex-1">
          <AppointmentsCard />
        </div>
      )}
    </div>
  );
}
