'use client';

import { doSchedule } from '@/app/(schedule)/schedule/[id]/action';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React, { useActionState, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type AvailableDays = Partial<Record<Weekday, string[]>>;

interface ProfessionalData {
  id: string;
  name: string;
  available_days: AvailableDays;
  created_at: string;
  email: string;
}

type ScheduleState =
  | { success: true; error?: undefined }
  | { success?: false; error: string };

export default function ScheduleForm({
  professionalId,
  professionalData,
}: {
  professionalId: string;
  professionalData: ProfessionalData;
}) {
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    selectedDate: '',
    selectedTime: '',
    selectedWeekday: '',
  });
  const [state, formAction] = useActionState<ScheduleState, FormData>(
    doSchedule,
    {
      success: false,
      error: '',
    }
  );

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form action={formAction} className="w-full max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">
        Agendamento com {professionalData?.name || '...'}
      </h1>

      <input type="hidden" name="professional_id" value={professionalId} />
      <input type="hidden" name="date" value={form.selectedDate} />

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {Object.keys(professionalData?.available_days ?? {}).map((day) => (
            <Button
              id="date"
              name="date"
              key={day}
              type="button"
              variant={form.selectedWeekday === day ? 'default' : 'outline'}
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  selectedWeekday: day,
                  selectedTime: '',
                  selectedDate: `${new Date().getFullYear()}-${day.split('/')[1]}-${day.split('/')[0]}`,
                }));
              }}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {form.selectedWeekday && (
        <div className="space-y-2">
          <Label htmlFor="time">Horário</Label>
          <Select
            name="time"
            value={form.selectedTime}
            onValueChange={(value) => handleChange('selectedTime', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um horário..." />
            </SelectTrigger>
            <SelectContent>
              {(
                professionalData?.available_days?.[
                  form.selectedWeekday as Weekday
                ] || []
              ).map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={form.selectedDate}
          onChange={(e) => handleChange('selectedDate', e.target.value)}
        />
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="client_name">Seu nome</Label>
        <Input
          id="client_name"
          name="client_name"
          type="text"
          value={form.clientName}
          onChange={(e) => handleChange('clientName', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_phone">Telefone</Label>
        <Input
          id="client_phone"
          name="client_phone"
          type="text"
          value={form.clientPhone}
          onChange={(e) => handleChange('clientPhone', e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Confirmar agendamento
      </Button>

      {state?.error && (
        <p className="text-red-500 text-sm mt-2">{state.error}</p>
      )}
    </form>
  );
}
