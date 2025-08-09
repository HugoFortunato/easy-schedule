import { Header } from '@/components/header';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  return (
    <>
      <Header />

      <main className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">
            Bem-vindo ao <span className="text-5xl">Easy Schedule</span>
          </h1>
          <p className="text-muted-foreground text-2xl">
            Gerencie seus agendamentos de forma simples e eficiente
          </p>
        </div>
      </main>

      {children}
    </>
  );
}
