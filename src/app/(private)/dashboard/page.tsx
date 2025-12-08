import { redirect } from 'next/navigation';
import { format, parseISO } from 'date-fns';

import { createClient } from '@/utils/supabase/server';
import ScheduleLink from '@/components/schedule-link';
import MySchedulesCard from '@/components/my-schedules-card';
import SettingsCard from '@/components/settings-card';

// Força revalidação a cada requisição
export const revalidate = 0;

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const { data: professionals } = await supabase
    .from('professionals')
    .select('*');

  const professional = professionals?.find(
    (p) => p?.email === data?.user?.email
  );

  const today = new Date().toISOString().split('T')[0];

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('professional_id', professional?.id)
    .gte('date', today)
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(1);

  const userId = professional?.id;

  if (error || !data?.user) {
    redirect('/signin');
  }

  const userName =
    data.user.user_metadata?.username ||
    data.user.email?.split('@')[0] ||
    'Usuário';

  // Verifica se o professional tem available_days configurados
  let hasAvailableDays = false;
  
  if (professional?.available_days) {
    const availableDaysObj = typeof professional.available_days === 'string' 
      ? JSON.parse(professional.available_days) 
      : professional.available_days;
    
    hasAvailableDays = Object.keys(availableDaysObj).length > 0;
  }

  console.log('Dashboard Debug:', {
    hasProfessional: !!professional,
    availableDays: professional?.available_days,
    hasAvailableDays,
  });

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Olá, {userName}!
          </h1>
          <p className="text-gray-600">
            Gerencie seus agendamentos e compartilhe sua agenda
          </p>
        </div>

        {!professional || !hasAvailableDays ? (
          <SettingsCard />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ScheduleLink activityToken={userId || ''} />
            </div>

            <div>
              <MySchedulesCard />
            </div>
          </div>
        )}

        {data.user && hasAvailableDays && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">
                Link compartilhado
              </h3>
              <p className="text-2xl font-bold text-green-600 mt-2">Ativo</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">
                Próximo horário
              </h3>

              <p className="text-2xl font-bold text-purple-600 mt-2">
                {appointments &&
                appointments.length > 0 &&
                appointments[0]?.date ? (
                  <>
                    {format(parseISO(appointments[0].date), 'dd/MM/yyyy')}{' '}
                    {' - '}
                    {appointments[0].time} - {appointments[0].client_name}
                  </>
                ) : (
                  'Nenhum agendamento'
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
