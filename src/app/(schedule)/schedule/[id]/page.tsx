import ScheduleForm from '@/components/schedule-form';
import { createClient } from '@/utils/supabase/server';

export default async function SchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', id)
    .single();

  return (
    <div className="flex w-screen h-screen items-center justify-center px-4">
      <ScheduleForm professionalId={id} professionalData={data} />
    </div>
  );
}
