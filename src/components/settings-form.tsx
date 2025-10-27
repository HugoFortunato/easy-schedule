'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import Cookies from 'js-cookie';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createActivity } from '@/app/(settings)/settings/action';

function getNextSixBusinessDays(): string[] {
  const result: string[] = [];
  const date = new Date();

  while (result.length < 6) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      result.push(`${day}/${month}`);
    }
    date.setDate(date.getDate() + 1);
  }

  return result;
}

const TIMES = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
];

export type SupabaseUserResponse = {
  user: {
    email: string;
    user_metadata: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
      username: string;
    };
  };
};

type DayKey = string;
type AvailableDays = Partial<Record<DayKey, string[]>>;

export default function SettingsForm({
  professionalData,
}: {
  professionalData: SupabaseUserResponse;
}) {
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [availableDays, setAvailableDays] = useState<AvailableDays>({});

  const AVAILABLE_DATES = getNextSixBusinessDays();

  const addDay = (day: DayKey) => {
    setAvailableDays((prev) => ({
      ...prev,
      [day]: prev[day] || [],
    }));
  };

  const removeDay = (day: DayKey) => {
    setAvailableDays((prev) => {
      const copy = { ...prev };
      delete copy[day];
      return copy;
    });
  };

  const toggleTime = (day: DayKey, time: string) => {
    setAvailableDays((prev) => {
      const times = prev[day] || [];
      const updated = times.includes(time)
        ? times.filter((t) => t !== time)
        : [...times, time];
      return { ...prev, [day]: updated };
    });
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      const activityResponse = await createActivity({
        name: professionalData.user.user_metadata.username,
        email: professionalData.user.email,
        available_days: availableDays as Record<string, string[]>,
      });

      Cookies.set('activity-token', activityResponse?.data?.id as string);
    });

    push('/dashboard');
  };

  return (
    <div className="h-screen flex items-center flex-col justify-center w-full max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold flex items-center justify-center whitespace-nowrap">
        Crie sua disponibilidade semanal
      </h1>

      <div className="gap-10 w-full flex flex-col items-center justify-center">
        <div className="space-y-2 mt-4">
          <Label>Dias disponíveis</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_DATES.map((day) => {
              const selected = day in availableDays;
              return (
                <Button
                  key={day}
                  type="button"
                  variant={selected ? 'default' : 'outline'}
                  onClick={() => (selected ? removeDay(day) : addDay(day))}
                >
                  {day}
                </Button>
              );
            })}
          </div>
        </div>

        {Object.entries(availableDays).map(([day, times]) => (
          <div key={day} className="space-y-2">
            <Label>Horários para {day}</Label>
            <div className="flex flex-wrap gap-2">
              {TIMES.map((time) => {
                const selected = times?.includes(time);
                return (
                  <Button
                    key={time}
                    type="button"
                    size="sm"
                    variant={selected ? 'default' : 'outline'}
                    onClick={() => toggleTime(day, time)}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <input
        type="hidden"
        name="available_days"
        value={JSON.stringify(availableDays)}
      />

      <Button type="button" onClick={handleSubmit} className="w-full">
        {isPending && <Loader className="animate-spin" />}
        Salvar disponibilidade
      </Button>
    </div>
  );
}
