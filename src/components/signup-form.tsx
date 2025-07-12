'use client';

import React from 'react';
import { useFormState } from 'react-dom';

import { Card, CardContent, CardHeader } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { AlertDescription } from './ui/alert';
import { Loader, MessageCircle } from 'lucide-react';
import { initialState } from '@/types/initialState';
import { signup } from '@/app/(auth)/signup/actions';

export default function SignUpForm() {
  const [state, formAction, isPending] = useFormState(signup, initialState);

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardContent className="contents">
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="maria@gmail.com"
                  required
                />

                <Label htmlFor="email">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="*********"
                  required
                />
              </div>

              {state.success === true && (
                <div className="border border-red-500 rounded-md p-4 bg-red-50 flex gap-3 items-center">
                  <MessageCircle className="h-5 w-5 text-red-600 mt-1 flex" />
                  <div>
                    <AlertDescription className="text-red-700">
                      sucesso!!
                    </AlertDescription>
                  </div>
                </div>
              )}

              {state.success && (
                <div className="border border-red-500 rounded-md p-4 bg-red-50 flex gap-3 items-center">
                  <MessageCircle className="h-5 w-5 text-red-600 mt-1 flex" />
                  <div>
                    <AlertDescription className="text-red-700">
                      Ocorreu um erro ao registrar o email
                    </AlertDescription>
                  </div>
                </div>
              )}

              {state.error && (
                <div className="border border-red-500 rounded-md p-4 bg-red-50 flex gap-3 items-center">
                  <MessageCircle className="h-5 w-5 text-red-600 mt-1 flex" />
                  <div>
                    <AlertDescription className="text-red-700">
                      Ocorreu um erro ao registrar o email
                    </AlertDescription>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                {isPending && <Loader className="animate-spin" />}
                Registrar
              </Button>
            </div>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
