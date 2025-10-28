'use client';

import React from 'react';
import { Button } from './ui/button';

export default function CustomOrderList({
  getAppointments,
}: {
  getAppointments: (order: 'asc' | 'desc') => Promise<any>;
}) {
  return (
    <div>
      <Button onClick={() => getAppointments('asc')}>Ordem Crescente</Button>
      <Button onClick={() => getAppointments('desc')}>Ordem Decrescente</Button>
    </div>
  );
}
