'use client';

import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { deleteTimeSlot } from '@/app/(private)/availability/actions';
import { toast } from 'sonner';

interface TimeSlotActionsProps {
  date: string;
  time: string;
}

export default function TimeSlotActions({ date, time }: TimeSlotActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTime, setNewTime] = useState(time);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteTimeSlot(date, time);

      if (result.success) {
        toast.success('Horário removido com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao remover horário');
      }
    } catch {
      toast.error('Erro ao remover horário');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setNewTime(time);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-md">
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
        />

        <button
          onClick={handleCancel}
          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Cancelar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      key={time}
      className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-md group"
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="font-medium">{time}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
          title="Remover horário"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
