'use client';

import React from 'react';
import { Card, CardContent } from './ui/card';

interface ScheduleLinkProps {
  activityToken: string;
}

export default function ScheduleLink({ activityToken }: ScheduleLinkProps) {
  return (
    <Card className="w-full bg-gradient-to-r from-gray-900 to-black text-white shadow-xl border-0">
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-xl font-bold">Sua agenda está pronta!</h2>
            </div>
            <p className="text-white/80 mb-4 text-sm leading-relaxed">
              Compartilhe este link com seus clientes para que eles possam
              agendar horários diretamente na sua agenda.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center justify-between">
                <code className="text-white font-mono text-xs break-all pr-2">
                  {`http://localhost:3000/schedule/${activityToken}`}
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `http://localhost:3000/schedule/${activityToken}`
                    )
                  }
                  className="bg-white text-black px-3 py-1.5 rounded-md font-medium hover:bg-gray-100 transition-colors flex-shrink-0 flex items-center space-x-1"
                >
                  <svg
                    className="w-3 h-3"
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
                  <span className="cursor-pointer text-xs">Copiar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
