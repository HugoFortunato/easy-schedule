"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";

export interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  initialFocus?: boolean;
}

function Calendar({ className, selected, onSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDayClick = (day: Date) => {
    if (onSelect) {
      onSelect(day);
    }
  };

  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-center pt-1 relative items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </span>
        <button
          onClick={handleNextMonth}
          className="absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-gray-500 rounded-md w-9 font-normal text-[0.8rem] text-center"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-2">
        {Array.from({ length: Math.ceil(days.length / 7) }).map(
          (_, weekIndex) => (
            <div key={weekIndex} className="flex w-full mt-2">
              {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day) => {
                const isSelected = selected && isSameDay(day, selected);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "cursor-pointer h-9 w-9 p-0 font-normal text-center rounded-full text-sm transition-colors",
                      "hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300",
                      !isCurrentMonth && "text-gray-300",
                      isCurrentMonth &&
                        !isSelected &&
                        !isTodayDate &&
                        "text-gray-700",
                      isTodayDate &&
                        !isSelected &&
                        "bg-purple-100 text-purple-700 font-semibold",
                      isSelected &&
                        "bg-black text-white font-semibold hover:bg-purple-700 shadow-md"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
