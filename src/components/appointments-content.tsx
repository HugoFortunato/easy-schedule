'use client';

import { Button } from './ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import AppointmentsWrapper from './appointments-wrapper';
import { useTransition } from 'react';

interface AppointmentsContentProps {
  appointments: Appointment[];
  deleteAllAppointments: () => void;
}

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  date: string;
  time: string;
}

export default function AppointmentsContent({
  appointments,
  deleteAllAppointments,
}: AppointmentsContentProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Meus Agendamentos
            </h1>

            <p className="text-gray-600">
              Visualize e gerencie todos os seus agendamentos
            </p>
          </div>

          <Button
            onClick={() => startTransition(() => deleteAllAppointments())}
            variant="destructive"
            disabled={isPending}
            size="sm"
            className="cursor-pointer w-[220px]"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Excluir agendamentos
              </>
            )}
          </Button>
        </div>

        {appointments && appointments.length > 0 ? (
          <AppointmentsWrapper />
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
