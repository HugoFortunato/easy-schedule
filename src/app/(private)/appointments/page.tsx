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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Meus Agendamentos
          </h1>
          <p className="text-gray-600">
            Visualize e gerencie todos os seus agendamentos
          </p>
        </div>

        {appointments && appointments.length > 0 ? (
          <AppointmentsCard />
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-500">
                Quando você receber agendamentos, eles aparecerão aqui.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
