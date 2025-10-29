'use client';

import { useActionState } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  requestPasswordReset,
  ForgotPasswordState,
} from '@/app/(auth)/forgot-password/actions';

const initialState: ForgotPasswordState = {
  success: false,
  isLoading: false,
};

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<
    ForgotPasswordState,
    FormData
  >(requestPasswordReset, initialState);

  console.log(isPending, 'isLoading');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Esqueceu sua senha?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1"
            placeholder="seu@email.com"
          />
        </div>

        {state.error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span>{state.error}</span>
          </div>
        )}

        {state.success && state.message && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span>{state.message}</span>
          </div>
        )}

        {isPending ? (
          <Button type="submit" className="w-full" disabled>
            Enviando...
          </Button>
        ) : (
          <Button type="submit" className="w-full">
            Enviar link de recuperação
          </Button>
        )}
      </form>

      <div className="text-center text-sm text-gray-600">
        <Link
          href="/signin"
          className="font-medium text-gray-900 hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
