'use client';

import { doSchedule } from '@/app/(schedule)/schedule/[id]/action';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React, { useActionState, useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Loader } from 'lucide-react';
import { usePhoneMask } from '@/hooks/usePhoneMask';
import { toast } from 'sonner';

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
  const weekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const phoneMask = usePhoneMask('');

  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    selectedDate: '',
    selectedTime: '',
    selectedWeekday: '',
    reason: '',
  });
  const [state, formAction, isPending] = useActionState<
    ScheduleState,
    FormData
  >(doSchedule, {
    success: false,
    error: '',
  });

  const getDateLabels = (day: any) => {
    const dayNumber = day.split('/')[0];
    const monthNumber = day.split('/')[1] - 1;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    if (Number(monthNumber) > currentMonth) {
      const dayOfWeek =
        weekDays[
          new Date(currentYear, currentMonth + 1, Number(dayNumber)).getDay()
        ];

      return dayOfWeek;
    } else {
      const dayOfWeek =
        weekDays[
          new Date(currentYear, currentMonth, Number(dayNumber)).getDay()
        ];

      return dayOfWeek;
    }
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    const formattedPhone = phoneMask.handleChange(value);
    setForm((prev) => ({ ...prev, clientPhone: formattedPhone }));
  };

  useEffect(() => {
    if (state?.success) {
      toast.success('Agendamento realizado com sucesso!', {
        description: `Seu agendamento foi confirmado para ${form.selectedDate} às ${form.selectedTime}`,
        duration: 5000,
      });

      setForm({
        clientName: '',
        clientPhone: '',
        selectedDate: '',
        selectedTime: '',
        selectedWeekday: '',
        reason: '',
      });

      phoneMask.setValue('');
    } else if (state?.error) {
      toast.error('Erro ao realizar agendamento', {
        description: state.error,
        duration: 5000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success, state?.error, form.selectedDate, form.selectedTime]);

  return (
    <form action={formAction} className="w-full max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">
        Agendamento com {professionalData?.name || '...'}
      </h1>

      <input type="hidden" name="professional_id" value={professionalId} />
      <input type="hidden" name="date" value={form.selectedDate} />
      <input
        type="hidden"
        name="client_phone"
        value={phoneMask.getUnmaskedValue()}
      />

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
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

              <span className="text-md text-black">{getDateLabels(day)}</span>
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
          type="text"
          value={form.clientPhone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="(11) 99999-9999"
          maxLength={15}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Motivo</Label>
        <Input
          id="reason"
          name="reason"
          type="text"
          value={form.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          placeholder="Ex: barba e cabelo"
        />
      </div>

      <Button type="submit" className="w-full">
        {isPending && <Loader className="animate-spin" />}
        Confirmar agendamento
      </Button>

      {state?.error && (
        <p className="text-red-500 text-sm mt-2">{state.error}</p>
      )}
    </form>
  );
}
