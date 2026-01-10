"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";

import { createClient } from "@/utils/supabase/client";

import { Card, CardContent } from "./ui/card";
import EditAppointmentCard from "./edit-appointment-card";
import { toast } from "sonner";

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  date: string;
  time: string;
  professional_id: string;
  reason?: string;
}

export interface AppointmentsCardRef {
  deleteByVoice: (name?: string, time?: string) => Promise<boolean>;
  refresh: () => void;
}

function formatPhone(phone: string): string {
  if (!phone) return "";

  const numbers = phone.replace(/\D/g, "");

  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  return phone;
}

function formatDateToDayMonth(date: string | Date) {
  const d = new Date(date);

  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

const AppointmentsCard = forwardRef<
  AppointmentsCardRef,
  {
    order: "asc" | "desc";
    currentDate: string | undefined;
  }
>(function AppointmentsCard({ order, currentDate }, ref) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const today = new Date().toISOString().split("T")[0];

  const fetchAppointments = async () => {
    setLoading(true);

    try {
      const { data } = await supabase.auth.getUser();

      const name = data?.user?.user_metadata?.username;

      const { data: userInfo } = await supabase
        .from("professionals")
        .select("*")
        .eq("name", name)
        .single();

      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select("*")
        .eq("professional_id", userInfo?.id)
        .eq("date", currentDate ?? today)
        .order("time", { ascending: order === "asc" });

      const { data: professional } = await supabase
        .from("professionals")
        .select("*")
        .eq("name", name)
        .single();

      const formattedDate = formatDateToDayMonth(currentDate ?? today);

      if (professional.available_days?.[formattedDate]) {
        setAppointments(appointmentsData || []);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      await supabase.from("appointments").delete().eq("id", appointmentId);

      fetchAppointments();
    } catch {
      toast.error("Erro ao deletar agendamento:");
    }
  };

  const deleteByVoice = async (
    name?: string,
    time?: string
  ): Promise<boolean> => {
    let appointment: Appointment | undefined;

    if (name) {
      appointment = appointments.find((a) =>
        a.client_name.toLowerCase().includes(name.toLowerCase())
      );
    } else if (time) {
      appointment = appointments.find((a) =>
        a.time.startsWith(time.slice(0, 2))
      );
    }

    if (appointment) {
      await deleteAppointment(appointment.id);
      return true;
    }

    return false;
  };

  useImperativeHandle(ref, () => ({
    deleteByVoice,
    refresh: fetchAppointments,
  }));

  const isAppointmentPast = (date: string, time: string) => {
    const now = new Date();
    const brazilDateTime = now.toLocaleString("sv-SE", {
      timeZone: "America/Sao_Paulo",
    });
    const [today, timeWithSeconds] = brazilDateTime.split(" ");
    const currentTime = timeWithSeconds.slice(0, 5);

    if (date < today) return true;
    if (date === today && time < currentTime) return true;
    return false;
  };

  useEffect(() => {
    fetchAppointments();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, currentDate]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (appointments?.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum agendamento encontrado
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments
        ?.filter(
          (appointment) =>
            !isAppointmentPast(appointment.date, appointment.time)
        )
        .map((appointment) => (
          <Card
            key={appointment.id}
            className={`w-full bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                      {appointment.client_name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Agendado
                    </span>
                    <div className="ml-auto sm:hidden">
                      <Trash2
                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => deleteAppointment(appointment.id)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                      <span className="truncate">
                        {format(parseISO(appointment.date), "dd/MM/yyyy")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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

                      <EditAppointmentCard
                        appointment={appointment}
                        onUpdate={fetchAppointments}
                      />
                    </div>

                    {appointment.reason && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {appointment.reason}
                        </span>
                      </div>
                    )}

                    {appointment.client_phone && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="truncate">
                          {formatPhone(appointment.client_phone)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden sm:block">
                  <Trash2
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 flex-shrink-0"
                    onClick={() => deleteAppointment(appointment.id)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
});

export default AppointmentsCard;
