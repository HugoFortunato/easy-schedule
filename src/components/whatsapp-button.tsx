'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface WhatsAppButtonProps {
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
}

export default function WhatsAppButton({
  clientName,
  clientPhone,
  appointmentDate,
  appointmentTime,
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const phoneNumber = clientPhone.replace(/\D/g, '');
    const formattedDate = format(parseISO(appointmentDate), 'dd/MM/yyyy');
    const message = `Olá ${clientName}! 👋\n\nLembrando sobre seu agendamento:\n📅 Data: ${formattedDate}\n🕐 Horário: ${appointmentTime}\n\nNos vemos em breve! 😊`;
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!clientPhone) return null;

  return (
    <Button
      size="sm"
      onClick={handleWhatsAppClick}
      className="bg-green-500 hover:bg-green-600 text-white"
      title="Enviar lembrete pelo WhatsApp"
    >
      <MessageCircle className="w-4 h-4" />
    </Button>
  );
}
