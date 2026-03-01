"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createActivity } from "@/app/(settings)/settings/action";

function getBusinessDaysUntilNewYear(): Array<{
  display: string;
  value: string;
}> {
  const result: Array<{ display: string; value: string }> = [];
  const date = new Date();
  // TODO: Change to the actual end date
  const endDate = new Date("2026-03-31T23:59:59");

  const weekDays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  while (date <= endDate) {
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
  const [availableDays, setAvailableDays] = useState<AvailableDays>({});
  const [error, setError] = useState<string | null>(null);

  const AVAILABLE_DATES = getBusinessDaysUntilNewYear();

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
                      selected ? removeDay(dayObj.value) : addDay(dayObj.value)
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

        <input
          type="hidden"
          name="available_days"
          value={JSON.stringify(availableDays)}
        />

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full"
          disabled={isPending}
        >
          {isPending && <Loader className="animate-spin mr-2" />}
          Salvar disponibilidade
        </Button>
      </div>
    </div>
  );
}
