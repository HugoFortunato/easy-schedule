import { Header } from '@/components/header';
import { createClient } from '@/utils/supabase/server';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const user = data?.user;

  return (
    <>
      <Header userAvatar={user?.user_metadata.username} />
      {children}
    </>
  );
}
