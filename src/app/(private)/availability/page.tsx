import React from 'react';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import AvailabilityContent from './availability-content';

export default async function Availability() {
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

  const available_days_raw = userInfo?.available_days;

  let available_days: Record<string, string[]> = {};

  if (typeof available_days_raw === 'string') {
    try {
      available_days = JSON.parse(available_days_raw);
    } catch (e) {
      available_days = {};
    }
  } else if (
    typeof available_days_raw === 'object' &&
    available_days_raw !== null
  ) {
    available_days = available_days_raw as Record<string, string[]>;
  }

  const availableDates = Object.keys(available_days).filter(
    (date) =>
      available_days[date] &&
      Array.isArray(available_days[date]) &&
      available_days[date].length > 0
  );

  const sortedDates = availableDates.sort((a, b) => {
    const [dayA, monthA] = a.split('/').map(Number);
    const [dayB, monthB] = b.split('/').map(Number);

    if (monthA !== monthB) {
      return monthA - monthB;
    }
    return dayA - dayB;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Minha Disponibilidade
          </h1>

          <p className="text-gray-600">
            Visualize e gerencie seus horários de disponibilidade
          </p>
        </div>

        <AvailabilityContent
          available_days={available_days}
          sortedDates={sortedDates}
        />
      </div>
    </div>
  );
}
