import { redirect } from 'next/navigation';
import { format } from 'date-fns';

import { createClient } from '@/utils/supabase/server';
import ScheduleLink from '@/components/schedule-link';
import MySchedulesCard from '@/components/my-schedules-card';
import SettingsCard from '@/components/settings-card';
import AvailabilityCard from '@/components/availability-card';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const { data: professionals } = await supabase
    .from('professionals')
    .select('*');

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*');

  const professional = professionals?.find(
    (p) => p?.email === data?.user?.email
  );

  const userId = professional?.id;

  // Filtrar e ordenar os agendamentos futuros do profissional
  const futureAppointments = appointments
    ?.filter((appointment) => appointment.professional_id === userId)
    ?.filter((appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.time}`
      );
      const now = new Date();
      return appointmentDateTime > now;
    })
    ?.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

  const nextAppointment = futureAppointments?.[0];

  if (error || !data?.user) {
    redirect('/signin');
  }

  const userName =
    data.user.user_metadata?.username ||
    data.user.email?.split('@')[0] ||
    'Usuário';

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

        {!professional ? (
          <SettingsCard />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <ScheduleLink activityToken={userId || ''} />
            </div>

            <div>
              <MySchedulesCard />
            </div>

            <div>
              <AvailabilityCard />
            </div>
          </div>
        )}

        {data.user && (
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

              {nextAppointment ? (
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  {format(nextAppointment?.date, 'dd/MM/yyyy')} {' - '}
                  {nextAppointment?.time} - {nextAppointment?.client_name}
                </p>
              ) : (
                <p className="text-lg font-bold text-purple-600 mt-2">--</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
