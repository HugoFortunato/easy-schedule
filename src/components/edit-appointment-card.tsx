'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { updateAppointment } from '@/app/(private)/appointments/actions';
import { Edit, Save, X, MessageCircle } from 'lucide-react';

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  date: string;
  time: string;
  professional_id: string;
}

interface EditAppointmentCardProps {
  appointment: Appointment;
  onUpdate: () => void;
}

const TIMES = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
];

export default function EditAppointmentCard({
  appointment,
  onUpdate,
}: EditAppointmentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTime, setEditedTime] = useState(appointment.time);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (editedTime === appointment.time) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateAppointment(appointment.id, editedTime);

      if (result.success) {
        toast.success('Horário atualizado com sucesso!', {
          description: `Novo horário: ${editedTime}`,
        });

        setIsEditing(false);
        onUpdate();
      } else {
        toast.error('Erro ao atualizar horário', {
          description: result.error || 'Tente novamente em alguns instantes.',
        });
      }
    } catch {
      toast.error('Erro ao atualizar horário', {
        description: 'Tente novamente em alguns instantes.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedTime(appointment.time);
    setIsEditing(false);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = appointment.client_phone.replace(/\D/g, '');
    const formattedDate = new Date(appointment.date).toLocaleDateString(
      'pt-BR'
    );
    const message = `Olá ${appointment.client_name}! 👋\n\nSeu agendamento foi alterado:\n📅 Data: ${formattedDate}\n🕐 Novo horário: ${editedTime}\n\nPor favor, confirme se este novo horário está adequado para você.\n\nObrigado! 😊`;
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Select value={editedTime} onValueChange={setEditedTime}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMES.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>

          {editedTime !== appointment.time && (
            <Button
              size="sm"
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600"
              title="Avisar cliente pelo WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{appointment.time}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="p-1 h-6 w-6"
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
