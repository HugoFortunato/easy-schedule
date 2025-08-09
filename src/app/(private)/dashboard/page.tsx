// import { format } from 'date-fns';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/server';
// import Image from 'next/image';
import ScheduleLink from '@/components/schedule-link';
import MySchedulesCard from '@/components/my-schedules-card';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const activityToken = (await cookies()).get('activity-token')?.value;

  if (error || !data?.user) {
    redirect('/signin');
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
        {activityToken && (
          <div className="flex-1">
            <ScheduleLink activityToken={activityToken} />
          </div>
        )}

        <MySchedulesCard />
      </div>
    </div>
  );
}
