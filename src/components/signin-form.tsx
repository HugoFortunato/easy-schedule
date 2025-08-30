'use client';

import React, { useActionState } from 'react';
import { Card, CardContent } from './ui/card';
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Entrar na conta</h2>
        <p className="mt-2 text-gray-600">
          Acesse sua conta para gerenciar seus agendamentos
        </p>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {state.error && (
              <div className="border border-red-200 rounded-lg p-4 bg-red-50 flex gap-3 items-start">
                <MessageCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <AlertDescription className="text-red-700">
                    Erro ao fazer login. Verifique suas credenciais e tente
                    novamente.
                  </AlertDescription>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                {isPending && <Loader className="animate-spin mr-2 h-4 w-4" />}
                Entrar
              </Button>

              <Button
                type="button"
                className="w-full"
                variant="ghost"
                onClick={() => redirect('/signup')}
              >
                Criar nova conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-gray-500">
        Ao entrar, você concorda com nossos termos de serviço e política de
        privacidade.
      </p>
    </div>
  );
}
