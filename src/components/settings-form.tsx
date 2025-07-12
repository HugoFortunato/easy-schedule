'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createActivity } from '@/app/(settings)/settings/action';

// 🔧 Gera os próximos 6 dias úteis (segunda a sábado)
function getNextSixBusinessDays(): string[] {
  const result: string[] = [];
  const date = new Date();

  while (result.length < 6) {
    const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
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
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export type SupabaseUserResponse = {
  user: {
    email: string;
    // outros campos omitidos
  };
};

type DayKey = string; // agora são datas como "14/07"
type AvailableDays = Partial<Record<DayKey, string[]>>;

export default function SettingsForm({
  professionalData,
}: {
  professionalData: SupabaseUserResponse;
}) {
  const AVAILABLE_DATES = getNextSixBusinessDays();
  const [availableDays, setAvailableDays] = useState<AvailableDays>({});

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
    await createActivity({
      name: 'Renato',
      email: professionalData.user.email,
      available_days: availableDays as Record<string, string[]>,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold">Crie sua disponibilidade</h1>

      <div className="space-y-2">
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

      <input
        type="hidden"
        name="available_days"
        value={JSON.stringify(availableDays)}
      />

      <Button type="button" onClick={handleSubmit} className="w-full">
        Salvar disponibilidade
      </Button>
    </div>
  );
}
