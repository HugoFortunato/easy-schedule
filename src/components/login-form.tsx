'use client';

import React, { useActionState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader, MessageCircle } from 'lucide-react';
import { login } from '@/app/(auth)/login/actions';
import { initialState } from '@/types/initialState';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <Card className=" mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Digite seu email para receber um link de login
        </CardDescription>
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

                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="****"
                  required
                />
              </div>

              {/* {state.success === true && (
                <Alert className="text-muted-foreground">
                  <MessageCircle className="h-4 w-4 !text-green-600" />
                  <AlertTitle className="text-gray-50">
                    Email enviado!
                  </AlertTitle>
                  <AlertDescription>
                    Confira seu inbox para acessar o link de login.
                  </AlertDescription>
                </Alert>
              )} */}

              {state.success === false && (
                <Alert className="text-muted-foreground">
                  <MessageCircle className="h-4 w-4 !text-red-600" />
                  <AlertTitle className="text-gray-50">Erro!</AlertTitle>
                  <AlertDescription>
                    Ocorreu um erro ao enviar o email
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-red-600">
                {isPending && <Loader className="animate-spin" />}
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
