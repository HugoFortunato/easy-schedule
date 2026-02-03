"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import AppointmentsWrapper from "./appointments-wrapper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { deleteAppointmentsByDate } from "@/app/(private)/appointments/actions";

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  date: string;
  time: string;
  professional_id: string;
}

interface AppointmentsContentProps {
  deleteAllAppointments: () => void;
  appointments: Appointment[];
}

export default function AppointmentsContent({
  deleteAllAppointments,
  appointments,
}: AppointmentsContentProps) {
  const [isPending, startTransition] = useTransition();
  const [isRemoveDayDialogOpen, setIsRemoveDayDialogOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [selectedRemoveDate, setSelectedRemoveDate] = useState<
    Date | undefined
  >(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const formattedDate = date.toISOString().split("T")[0];

    setSelectedDate(formattedDate);
  };

  const handleConfirmRemoveDay = () => {
    if (selectedRemoveDate) {
      deleteAppointmentsByDate(selectedRemoveDate.toISOString().split("T")[0]);

      setIsRemoveDayDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Meus Agendamentos
            </h1>

            <p className="text-gray-600">
              Visualize e gerencie todos os seus agendamentos
            </p>
          </div>

          <div className="flex flex-col items-center justify-center md:flex-row gap-2">
            <Dialog
              open={isRemoveDayDialogOpen}
              onOpenChange={setIsRemoveDayDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Houve um imprevisto? Remova um dia da sua agenda!
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle className="mt-10 mb-4 text-start whitespace-nowrap text-sm font-bold">
                    Escolha a data que você deseja remover da sua agenda:
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center px-6 pb-6">
                  <div className="flex justify-center w-full">
                    <Calendar
                      selected={selectedRemoveDate}
                      onSelect={setSelectedRemoveDate}
                      initialFocus
                    />
                  </div>
                  <Button
                    onClick={handleConfirmRemoveDay}
                    disabled={!selectedRemoveDate}
                    className="mt-6 w-full"
                    variant="default"
                  >
                    Confirmar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => startTransition(() => deleteAllAppointments())}
              variant="destructive"
              disabled={isPending}
              size="sm"
              className="cursor-pointer w-[220px]"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Excluir agendamentos
                </>
              )}
            </Button>
          </div>
        </div>

        {appointments && appointments.length > 0 ? (
          <AppointmentsWrapper
            onDateSelect={handleDateSelect}
            currentDate={selectedDate}
          />
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-500">
                Quando você receber agendamentos, eles aparecerão aqui.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
