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

  return (
    <>
      <div className="flex justify-end gap-2 mb-6 flex-wrap">
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
