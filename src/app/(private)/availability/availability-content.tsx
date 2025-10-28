'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import TimeSlotActions from '@/components/time-slot-actions';

const weekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

interface AvailabilityContentProps {
  available_days: Record<string, string[]>;
  sortedDates: string[];
}

export default function AvailabilityContent({
  available_days,
  sortedDates,
}: AvailabilityContentProps) {
  const getDateLabels = (day: string) => {
    const dayNumber = day.split('/')[0];
    const monthNumber = Number(day.split('/')[1]) - 1;

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

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum horário configurado
          </h3>
          <p className="text-gray-500">
            Configure sua disponibilidade nas configurações para começar a
            receber agendamentos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedDates.map((date) => {
        const times = available_days[date] || [];

        return (
          <div
            key={date}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {date} - {getDateLabels(date)}
              </h3>
            </div>

            {times.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Sem horários disponíveis
              </p>
            ) : (
              <div className="space-y-2">
                {times.map((time, index) => (
                  <TimeSlotActions key={index} date={date} time={time} />
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {times.length} horário{times.length !== 1 ? 's' : ''} disponível
                {times.length !== 1 ? 'is' : ''}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
