"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createActivity } from "@/app/(settings)/settings/action";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

function getBusinessDaysUntilEndDate(endDate?: Date): Array<{
  display: string;
  value: string;
}> {
  if (!endDate) {
    return [];
  }

  const date = new Date();
  const result: Array<{ display: string; value: string }> = [];
  const limitDate = new Date(endDate);

  const weekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  while (date <= limitDate) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const weekDayName = weekDays[dayOfWeek];
      const value = `${day}/${month}`;
      const display = `${day}/${month} - ${weekDayName}`;
      result.push({ display, value });
    }
    date.setDate(date.getDate() + 1);
  }

  return result;
}

const TIMES = [
  "08:00",
  "08:40",
  "09:20",
  "10:00",
  "10:40",
  "11:20",
  "12:00",
  "12:40",
  "13:20",
  "14:00",
  "14:40",
  "15:20",
  "16:00",
  "16:40",
  "17:20",
  "18:00",
  "18:40",
  "19:20",
  "20:00",
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [availableDays, setAvailableDays] = useState<AvailableDays>({});
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const AVAILABLE_DATES = getBusinessDaysUntilEndDate(endDate);

  const handleEndDateSelect = (selectedDate?: Date) => {
    if (!selectedDate) {
      setEndDate(undefined);
      return;
    }

    const normalizedEndDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      23,
      59,
      59
    );

    const formattedEndDate = format(selectedDate, "dd/MM/yyyy");
    setEndDate(normalizedEndDate);

    toast.success("Último dia da agenda selecionado!", {
      description: `Até ${formattedEndDate}`,
    });
  };

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
    setError(null);

    const daysWithTimes = Object.entries(availableDays).filter(
      ([, times]) => times && times.length > 0
    );

    if (daysWithTimes.length === 0) {
      setError("Selecione pelo menos um dia e seus horários disponíveis");
      return;
    }

    startTransition(async () => {
      const activityResponse = await createActivity({
        name: professionalData.user.user_metadata.username,
        email: professionalData.user.email,
        available_days: availableDays as Record<string, string[]>,
      });

      if (activityResponse.success && activityResponse.data) {
        Cookies.set("activity-token", activityResponse.data.id);
        router.push("/dashboard");
      } else {
        setError(activityResponse.error || "Erro ao salvar disponibilidade");
      }
    });
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto p-4 py-8 overflow-y-auto">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          Crie sua disponibilidade semanal
        </h1>

        <div
          className={`flex flex-col items-center justify-center w-full overflow-hidden transition-all duration-500 ease-out ${
            endDate
              ? "max-h-0 opacity-0 -translate-y-2"
              : "max-h-[420px] opacity-100 translate-y-0"
          }`}
        >
          <Label>Selecione o último dia da sua agenda</Label>
          <Calendar fromDate={new Date()} onDayClick={handleEndDateSelect} />
        </div>

        <div
          className={`w-full overflow-hidden transition-all duration-500 ease-out ${
            endDate
              ? "max-h-[3000px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 translate-y-2"
          }`}
        >
          {endDate && (
            <p className="text-xs text-muted-foreground mb-3">
              Último dia da agenda: {format(endDate, "dd/MM/yyyy")}
            </p>
          )}
          <div className="gap-10 w-full flex flex-col items-center justify-center">
            <div className="space-y-2 mt-4 w-full">
              <Label>Dias disponíveis</Label>
              <div className="grid grid-cols-2 gap-2 w-full">
                {AVAILABLE_DATES.map((dayObj) => {
                  const selected = dayObj.value in availableDays;
                  return (
                    <Button
                      key={dayObj.value}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      onClick={() =>
                        selected
                          ? removeDay(dayObj.value)
                          : addDay(dayObj.value)
                      }
                    >
                      {dayObj.display}
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
                        variant={selected ? "default" : "outline"}
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
        </div>

        <input
          type="hidden"
          name="available_days"
          value={JSON.stringify(availableDays)}
        />

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {endDate && (
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full"
            disabled={isPending}
          >
            {isPending && <Loader className="animate-spin mr-2" />}
            Salvar disponibilidade
          </Button>
        )}
      </div>
    </div>
  );
}
