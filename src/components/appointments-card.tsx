import React from 'react';
import { format } from 'date-fns';

import { createClient } from '@/utils/supabase/server';

import { Card, CardContent } from './ui/card';

export default async function AppointmentsCard() {
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
    <div className="space-y-4">
      {appointments?.map((appointment) => (
        <Card
          key={appointment.id}
          className="w-full bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {appointment.client_name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Agendado
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {format(new Date(appointment.date), 'dd/MM/yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
