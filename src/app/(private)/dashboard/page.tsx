import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/server';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/signin');
  }

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
    .order('date', { ascending: true }); // Ordena pela data

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-center">
        Próximos agendamentos
      </h1>

      {appointments?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="bg-muted">
              <CardHeader className="text-base font-medium">
                {appointment.client_name}
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  <strong>Data:</strong>{' '}
                  {format(new Date(appointment.date), 'dd/MM/yyyy')}
                </p>
                <p>
                  <strong>Hora:</strong> {appointment.time}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Nenhum agendamento encontrado.
        </p>
      )}
    </div>
  );
}
