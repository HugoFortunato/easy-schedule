"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type UpdateAppointmentState =
  | { success: true; error?: undefined }
  | { success?: false; error: string };

function formatDateToDayMonth(date: string | Date) {
  const d = new Date(date);

  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

export async function updateAppointment(
  appointmentId: string,
  newTime: string
): Promise<UpdateAppointmentState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Usuário não autenticado" };
  }

  const { data: appointment, error: fetchError } = await supabase
    .from("appointments")
    .select("professional_id")
    .eq("id", appointmentId)
    .single();

  if (fetchError || !appointment) {
    return { error: "Agendamento não encontrado" };
  }

  const { data: professional } = await supabase
    .from("professionals")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!professional || professional.id !== appointment.professional_id) {
    return { error: "Você não tem permissão para editar este agendamento" };
  }

  const { error: updateError } = await supabase
    .from("appointments")
    .update({ time: newTime })
    .eq("id", appointmentId);

  if (updateError) {
    return { error: "Erro ao atualizar agendamento. Tente novamente." };
  }

  return { success: true };
}

export async function deleteAllAppointments() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Usuário não autenticado" };
  }

  const { data: professional } = await supabase
    .from("professionals")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!professional) {
    return { error: "Profissional não encontrado" };
  }

  await supabase
    .from("appointments")
    .delete()
    .eq("professional_id", professional.id);

  await supabase.from("professionals").delete().eq("id", professional.id);

  revalidatePath("/appointments");

  return { success: true };
}

export async function deleteAppointmentsByDate(date: string) {
  const formattedDate = formatDateToDayMonth(date);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado" };
  }

  const { data: professional } = await supabase
    .from("professionals")
    .select("*")
    .eq("name", user.user_metadata.username)
    .single();

  const updatedAvailableDays = Object.fromEntries(
    Object.entries(professional.available_days).filter(
      ([day]) => day !== formattedDate
    )
  );

  await supabase
    .from("professionals")
    .update({ available_days: updatedAvailableDays })
    .eq("id", professional.id);

  revalidatePath("/appointments");

  return { success: true };
}
