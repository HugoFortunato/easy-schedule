'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  changePassword,
  ChangePasswordState,
} from '@/app/(private)/change-password/actions';
import { useActionState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const initialState: ChangePasswordState = {
  success: false,
};

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState<
    ChangePasswordState,
    FormData
  >(changePassword, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword">Senha atual</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          className="mt-1"
          placeholder="Digite sua senha atual"
          disabled={isPending}
        />
      </div>

      <div>
        <Label htmlFor="newPassword">Nova senha</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          className="mt-1"
          placeholder="Digite sua nova senha"
          minLength={6}
          disabled={isPending}
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="mt-1"
          placeholder="Confirme sua nova senha"
          minLength={6}
          disabled={isPending}
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
          <CheckCircle className="w-4 h-4" />
          <span>{state.message}</span>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Alterando...' : 'Alterar senha'}
      </Button>
    </form>
  );
}
