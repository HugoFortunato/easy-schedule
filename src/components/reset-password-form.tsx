'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  resetPassword,
  ResetPasswordState,
} from '@/app/(auth)/reset-password/actions';
import { useActionState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const initialState: ResetPasswordState = {
  success: false,
};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, formAction] = useActionState<ResetPasswordState, FormData>(
    resetPassword,
    initialState
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return alert('Token inválido');

    const formData = new FormData(e.currentTarget);
    formData.append('token', token);

    formAction(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Defina sua nova senha
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Digite uma nova senha segura para sua conta.
        </p>
      </div>

      <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1"
            placeholder="Digite sua nova senha"
            minLength={6}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="mt-1"
            placeholder="Confirme sua nova senha"
            minLength={6}
          />
        </div>

        {state.error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span>{state.error}</span>
          </div>
        )}

        <Button type="submit" className="w-full">
          Redefinir senha
        </Button>
      </form>
    </div>
  );
}
