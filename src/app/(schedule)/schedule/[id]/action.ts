"use server";

import { createClient } from "@/utils/supabase/server";

export type ScheduleState =
  | { success: true; error?: undefined; whatsappUrl?: string }
  | { success?: false; error: string };

export async function doSchedule(
  _prevState: ScheduleState,
  formData: FormData
): Promise<ScheduleState> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const reason = formData.get("reason") as string;
  const client_name = formData.get("client_name") as string;
  const client_phone = formData.get("client_phone") as string;
  const professional_id = formData.get("professional_id") as string;

  if (!client_name || !date || !time) {
    return { error: "Campos obrigatórios não preenchidos." };
  }

  const { data: existingAppointment } = await supabase
    .from("appointments")
    .select("*")
    .eq("professional_id", professional_id)
    .eq("date", date)
    .eq("time", time)
    .single();

  if (existingAppointment) {
    return { error: "Horário indisponível. Por favor, escolha outro horário." };
  }

  const { error } = await supabase.from("appointments").insert({
    professional_id,
    client_name,
    client_phone,
    date,
    time,
    reason,
  });

  if (error) {
    return { error: "Erro ao agendar. Tente novamente." };
  }

  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const formattedDate = `${day}/${month}`;

  const message = `Olá! Estou agendando meu horário para o dia ${formattedDate} às ${time}.${reason ? ` Motivo: ${reason}` : ""}`;

  const professionalPhone =
    `55${data.user?.user_metadata?.phone?.replace(/\D/g, "") || "5511989333434"}` ||
    "5511989333434";

  const whatsappUrl = `https://wa.me/${professionalPhone}?text=${encodeURIComponent(message)}`;

  return { success: true, whatsappUrl };
}
