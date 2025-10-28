'use client';

import React from 'react';
import { Card, CardContent } from './ui/card';
import { useRouter } from 'next/navigation';

export default function AvailabilityCard() {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push('/availability')}
      className="cursor-pointer bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Edite sua disponibilidade
            </h2>
            <p className="text-sm text-gray-600">
              Visualize e gerencie seus horários de disponibilidade.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Clique para acessar</div>
            <div className="flex items-center text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
