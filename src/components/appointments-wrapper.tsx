"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { format, parse, addDays, subDays } from "date-fns";
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
import VoiceCommandButton from "@/components/voice-command-button";
import { VoiceCommand } from "@/hooks/use-voice-commands";

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

  const parseVoiceDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;

    const lowerDate = dateString.toLowerCase().trim();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Datas relativas
    if (lowerDate === "hoje") {
      return today;
    } else if (lowerDate === "amanhã" || lowerDate === "amanha") {
      return addDays(today, 1);
    } else if (lowerDate === "ontem") {
      return subDays(today, 1);
    }

    // Tentar parsear datas em formato DD/MM/YYYY ou DD/MM
    const dateFormats = [
      "dd/MM/yyyy",
      "dd/MM/yy",
      "dd/MM",
      "d/MM/yyyy",
      "d/MM/yy",
      "d/MM",
    ];

    for (const formatStr of dateFormats) {
      try {
        const parsed = parse(lowerDate, formatStr, new Date(), {
          locale: ptBR,
        });
        if (isValidDate(parsed)) {
          // Se não tiver ano, usar o ano atual
          if (!lowerDate.includes("/20") && !lowerDate.includes("/19")) {
            parsed.setFullYear(today.getFullYear());
          }
          // Se a data for no passado e não tiver ano especificado, assumir próximo ano
          if (
            parsed < today &&
            !lowerDate.includes("/20") &&
            !lowerDate.includes("/19")
          ) {
            parsed.setFullYear(today.getFullYear() + 1);
          }

          return parsed;
        }
      } catch {
        continue;
      }
    }

    // Tentar extrair números do texto (ex: "15 de dezembro", "15 dezembro")
    const numberMatch = lowerDate.match(/(\d{1,2})/);
    if (numberMatch) {
      const day = parseInt(numberMatch[1], 10);
      if (day >= 1 && day <= 31) {
        const monthsMap: Record<string, number> = {
          janeiro: 0,
          fevereiro: 1,
          março: 2,
          marco: 2,
          abril: 3,
          maio: 4,
          junho: 5,
          julho: 6,
          agosto: 7,
          setembro: 8,
          outubro: 9,
          novembro: 10,
          dezembro: 11,
        };

        for (const [monthName, monthIndex] of Object.entries(monthsMap)) {
          if (lowerDate.includes(monthName)) {
            const year = today.getFullYear();
            const date = new Date(year, monthIndex, day);
            if (date < today) {
              date.setFullYear(year + 1);
            }
            return date;
          }
        }

        // Se só tem o dia, usar o mês atual
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const date = new Date(currentYear, currentMonth, day);
        if (date < today) {
          date.setMonth(currentMonth + 1);
          if (date < today) {
            date.setFullYear(currentYear + 1);
          }
        }
        return date;
      }
    }

    return undefined;
  };

  const handleVoiceCommand = (command: VoiceCommand) => {
    if (command.action === "limpar" || command.action === "desconhecido") {
      // Limpar filtro de data
      setSelectedDate(undefined);
      onDateSelect(undefined);
      toast.success("Filtro de data removido");
      return;
    }

    if (
      command.action === "filtrar" ||
      command.action === "ir para" ||
      command.action === "ontem" ||
      command.date
    ) {
      let dateToSelect: Date | undefined;

      if (command.action === "ontem") {
        dateToSelect = subDays(new Date(), 1);
      } else if (command.date) {
        dateToSelect = parseVoiceDate(command.date);
      } else if (command.action === "ir para") {
        // Extrair data do texto completo
        const dateText = command.rawText
          .toLowerCase()
          .replace(/ir para/i, "")
          .trim();
        dateToSelect = parseVoiceDate(dateText);
      }

      if (dateToSelect && isValidDate(dateToSelect)) {
        handleDateSelect(dateToSelect);
        toast.success(
          `Data selecionada: ${format(dateToSelect, "dd/MM/yyyy", { locale: ptBR })}`
        );
      } else {
        toast.error("Não foi possível entender a data. Tente novamente.");
      }
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-6 flex-wrap">
        <VoiceCommandButton onCommand={handleVoiceCommand} />

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
              fromDate={new Date()}
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

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
