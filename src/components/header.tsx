'use client';

// import Image from 'next/image';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

interface HeaderProps {
  userAvatar?: string;
}

export function Header({ userAvatar }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    document.cookie =
      'activity-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    router.push('/signin');
  };

  const handleGoBack = () => {
    router.back();
  };

  const userName = userAvatar || userAvatar?.split('@')[0] || 'Usuário';

  const showBackButton = pathname !== '/dashboard';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <ArrowLeft
              onClick={handleGoBack}
              className="h-4 w-4 mr-2 cursor-pointer"
            />
          )}

          <div className="flex items-center space-x-2">
            <Image
              src="/easyschedule-white.jpg"
              width={200}
              height={10}
              alt="Easy Schedule"
              className=""
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userAvatar || '/placeholder.svg'}
                alt={userName}
              />
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <LogOut
            onClick={handleLogout}
            className="h-4 w-4 mr-2 cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}
