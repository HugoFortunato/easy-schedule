"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpDown, CalendarIcon } from "lucide-react";

import AppointmentsCard, {
  AppointmentsCardRef,
} from "@/components/appointments-card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import VoiceCommandButton from "@/components/voice-command-button";
// import { VoiceCommand } from "@/hooks/use-voice-commands";

export default function AppointmentsWrapper({
  onDateSelect,
  currentDate,
}: {
  currentDate: string | undefined;
  onDateSelect: (date: Date | undefined) => void;
}) {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const appointmentsCardRef = useRef<AppointmentsCardRef>(null);

  function isValidDate(date: Date | undefined) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  const toggleOrder = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!isValidDate(date)) {
      toast.error("Data inválida. Tente novamente.");
      setSelectedDate(undefined);
      return;
    }

    setSelectedDate(date);
    setIsCalendarOpen(false);

    if (date) {
      onDateSelect(date);
    }
  };

  // const clearDateFilter = () => {
  //   setSelectedDate(undefined);
  //   onDateSelect(undefined);
  // };

  // const monthsMap: Record<string, number> = {
  //   janeiro: 0,
  //   fevereiro: 1,
  //   março: 2,
  //   abril: 3,
  //   maio: 4,
  //   junho: 5,
  //   julho: 6,
  //   agosto: 7,
  //   setembro: 8,
  //   outubro: 9,
  //   novembro: 10,
  //   dezembro: 11,
  // };

  // function parseVoiceDate(input: string): Date {
  //   const value = input.toLowerCase().trim();

  //   const slashMatch = value.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);

  //   if (slashMatch) {
  //     const day = Number(slashMatch[1]);
  //     const month = Number(slashMatch[2]) - 1;
  //     const year = slashMatch[3]
  //       ? Number(slashMatch[3])
  //       : new Date().getFullYear();

  //     return new Date(year, month, day);
  //   }

  //   const normalized = value.replace(/\b(do|de)\b/g, "").trim();
  //   const parts = normalized.split(/\s+/);

  //   const day = Number(parts[0]);
  //   const monthRaw = parts[1];
  //   const year = parts[2] ? Number(parts[2]) : new Date().getFullYear();

  //   const month = isNaN(Number(monthRaw))
  //     ? monthsMap[monthRaw]
  //     : Number(monthRaw) - 1;

  //   return new Date(year, month, day);
  // }

  // const handleVoiceCommand = async (command: VoiceCommand) => {
  //   switch (command.action) {
  //     case "excluir":
  //       if (command.target || command.time) {
  //         const deleted = await appointmentsCardRef.current?.deleteByVoice(
  //           command.target,
  //           command.time
  //         );
  //         if (deleted) {
  //           toast.success(
  //             `Agendamento excluído: ${command.target || command.time}`
  //           );
  //         } else {
  //           toast.error("Agendamento não encontrado");
  //         }
  //       } else {
  //         toast.error(
  //           'Especifique o nome ou horário. Ex: "Excluir agendamento do João"'
  //         );
  //       }
  //       break;

  //     case "filtrar":
  //       if (command.date === "hoje") {
  //         const today = new Date();
  //         today.setDate(today.getDate());
  //         handleDateSelect(today);
  //         clearDateFilter();
  //         toast.success("Mostrando agendamentos de hoje");
  //       } else if (command.date === "amanhã") {
  //         const tomorrow = new Date();
  //         tomorrow.setDate(tomorrow.getDate() + 1);
  //         handleDateSelect(tomorrow);
  //         toast.success("Mostrando agendamentos de amanhã");
  //       }
  //       break;

  //     case "ir para":
  //       if (command.date) {
  //         const date = parseVoiceDate(command.date);
  //         handleDateSelect(date);
  //       } else {
  //         toast.error("Especifique a data. Ex: 'Ir para 20/12/2025'");
  //       }
  //       break;

  //     case "limpar":
  //       clearDateFilter();
  //       toast.success("Filtro removido");
  //       break;

  //     case "desconhecido":
  //       toast.error(
  //         `Comando não reconhecido. Tente: "Excluir agendamento do [nome]" ou "Mostrar agendamentos de hoje"`
  //       );
  //       break;
  //   }
  // };

  return (
    <>
      <div className="flex justify-end gap-2 mb-6 flex-wrap">
        {/* <VoiceCommandButton onCommand={handleVoiceCommand} /> */}

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400"
              title="Filtrar por data"
            >
              <CalendarIcon className="w-5 h-5" />
              {isValidDate(selectedDate) ? (
                <span className="text-sm">
                  {format(selectedDate!, "dd/MM/yyyy", { locale: ptBR })}
                </span>
              ) : null}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="end">
            <Calendar
              mode="single"
              fromDate={new Date()}
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* {selectedDate && (
          <button
            onClick={clearDateFilter}
            className="flex items-center gap-1 px-3 py-2 rounded-md font-medium transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
            title="Limpar filtro de data"
          >
            <X className="w-4 h-4" />
          </button>
        )} */}

        <button
          onClick={toggleOrder}
          className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400"
          title={
            order === "asc" ? "Mais antigos primeiro" : "Mais recentes primeiro"
          }
        >
          <ArrowUpDown className="w-5 h-5" />
        </button>
      </div>

      <AppointmentsCard
        order={order}
        ref={appointmentsCardRef}
        currentDate={currentDate}
      />
    </>
  );
}
