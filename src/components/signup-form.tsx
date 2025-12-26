"use client";

import React, { useActionState, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertDescription } from "./ui/alert";
import { Loader, MessageCircle, CheckCircle } from "lucide-react";
import { initialState } from "@/types/initialState";
import { signup } from "@/app/(auth)/signup/actions";
import { redirect } from "next/navigation";
import { toast } from "sonner";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : "";
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export default function SignUpForm() {
  const [phone, setPhone] = useState("");

  const [state, formAction, isPending] = useActionState(signup, initialState);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Criar conta</h2>
        <p className="mt-2 text-gray-600">
          Cadastre-se para começar a gerenciar seus agendamentos
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
                <Label htmlFor="username" className="text-gray-700">
                  Nome de usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="seu_usuario"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-700">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="(11) 99999-9999"
                  className="mt-1"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={15}
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

            {state.success === true && (
              <div className="border border-green-200 rounded-lg p-4 bg-green-50 flex gap-3 items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  {toast.success(
                    "Conta criada com sucesso! Verifique seu e-mail para confirmar."
                  )}
                </div>
              </div>
            )}

            {state.error && (
              <div className="border border-red-200 rounded-lg p-4 bg-red-50 flex gap-3 items-start">
                <MessageCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <AlertDescription className="text-red-700">
                    Erro ao criar conta. Verifique os dados e tente novamente.
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
                Criar conta
              </Button>

              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={() => redirect("/signin")}
              >
                Já tenho uma conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-gray-500">
        Ao criar uma conta, você concorda com nossos termos de serviço e
        política de privacidade.
      </p>
    </div>
  );
}
