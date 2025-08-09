import React from 'react';
import { format } from 'date-fns';

import { createClient } from '@/utils/supabase/server';

import { Card, CardContent, CardHeader } from './ui/card';

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
    <>
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {appointments?.map((appointment) => (
            <Card
              key={appointment.id}
              className="w-full hover:shadow-lg transition-shadow duration-200 border-2 border-gray-100 hover:border-gray-200 bg-white"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {appointment.client_name}
                  </h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-4 h-4 mr-3"
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
                    <span className="font-medium">
                      {format(new Date(appointment.date), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-4 h-4 mr-3"
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
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
