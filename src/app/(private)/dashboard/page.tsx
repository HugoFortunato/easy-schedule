import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

import { createClient } from '@/utils/supabase/server';
import ScheduleLink from '@/components/schedule-link';
import MySchedulesCard from '@/components/my-schedules-card';
import SettingsCard from '@/components/settings-card';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const activityToken = (await cookies()).get('activity-token')?.value;

  const { data: userWeeklySchedule } = await supabase
    .from('professionals')
    .select('*');

  console.log(userWeeklySchedule, ' userWeeklySchedule');

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*');

  const nextAppointment = appointments?.find((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date();

    return appointmentDate > currentDate && appointment.date;
  });

  console.log(nextAppointment, 'nextAppointment');

  if (error || !data?.user) {
    redirect('/signin');
  }

  const userName =
    data.user.user_metadata?.username ||
    data.user.email?.split('@')[0] ||
    'Usuário';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Olá, {userName}!
          </h1>
          <p className="text-gray-600">
            Gerencie seus agendamentos e compartilhe sua agenda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activityToken && userWeeklySchedule?.length !== 0 && (
            <div>
              <ScheduleLink activityToken={activityToken} />
            </div>
          )}

          <div>
            <MySchedulesCard />
          </div>

          <div>{!userWeeklySchedule?.length && <SettingsCard />}</div>
        </div>

        {activityToken && (
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
                {format(nextAppointment.date, 'dd/MM/yyyy')} {' - '}
                {nextAppointment.time} - {nextAppointment.client_name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
