'use client';

import React, { useState } from 'react';
import AppointmentsCard from '@/components/appointments-card';
import { ArrowUpDown } from 'lucide-react';

export default function AppointmentsWrapper() {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const toggleOrder = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleOrder}
          className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400"
          title={
            order === 'asc' ? 'Mais antigos primeiro' : 'Mais recentes primeiro'
          }
        >
          <ArrowUpDown className="w-5 h-5" />
        </button>
      </div>

      <AppointmentsCard order={order} />
    </>
  );
}
