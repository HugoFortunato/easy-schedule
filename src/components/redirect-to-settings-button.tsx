'use client';

import React from 'react';
import { Button } from './ui/button';
import { redirect } from 'next/navigation';

export default function RedirectToSettingsButton() {
  return <Button onClick={() => redirect('/settings')}>configurações</Button>;
}
