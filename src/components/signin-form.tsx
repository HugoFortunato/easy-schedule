'use client';

import React, { useActionState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { AlertDescription } from './ui/alert';
import { Loader, MessageCircle } from 'lucide-react';
import { signin } from '@/app/(auth)/signin/actions';
import { initialState } from '@/types/initialState';
import { redirect } from 'next/navigation';

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(signin, initialState);

  return (
    <Card className=" mx-auto max-w-sm w-full">
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

              {state.error && (
                <div className="border border-red-500 rounded-md p-4 bg-red-50 flex gap-3 items-center">
                  <MessageCircle className="h-5 w-5 text-red-600 mt-1 flex" />
                  <div>
                    <AlertDescription className="text-red-700">
                      Ocorreu um erro ao enviar o email.
                    </AlertDescription>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                {isPending && <Loader className="animate-spin" />}
                Login
              </Button>

              <Button
                type="submit"
                className="w-full"
                variant="ghost"
                onClick={() => redirect('/signup')}
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
