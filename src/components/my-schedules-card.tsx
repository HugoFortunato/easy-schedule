'use client';

import React from 'react';
import { Card, CardContent } from './ui/card';
import { useRouter } from 'next/navigation';

export default function MySchedulesCard() {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push('/appointments')}
      className="cursor-pointer bg-gradient-to-r from-gray-900 to-black text-white shadow-xl border-0"
    >
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-xl font-bold">
                Confira aqui os seus agendamentos!
              </h2>
            </div>
            <p className="text-white/80 mb-4 text-sm">
              Aqui você pode visualizar e gerenciar seus agendamentos de forma
              simples e eficiente.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
