'use client';

import React from 'react';
import { Card, CardContent } from './ui/card';

interface ScheduleLinkProps {
  activityToken: string;
}

export default function ScheduleLink({ activityToken }: ScheduleLinkProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `http://localhost:3000/schedule/${activityToken}`
    );
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Link de Agendamento
            </h2>
            <p className="text-sm text-gray-600">
              Compartilhe este link para que seus clientes possam agendar
              horários.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <code className="text-sm text-gray-700 break-all font-mono">
                {`http://localhost:3000/schedule/${activityToken}`}
              </code>
              <button
                onClick={copyToClipboard}
                className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex-shrink-0 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copiar
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
