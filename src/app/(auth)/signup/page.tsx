import SignUpForm from '@/components/signup-form';
import Image from 'next/image';

export default async function RegisterPage() {
  return (
    <div className="flex w-screen h-screen items-center">
      <div className="hidden lg:flex lg:flex-1 lg:h-full lg:flex-col lg:justify-center lg:items-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-center space-y-8 px-12">
          <Image
            src="/easyschedule.png"
            width={400}
            height={100}
            alt="Easy Schedule"
            className="mx-auto"
          />
          <div className="max-w-md mx-auto text-gray-300">
            <p className="text-lg leading-relaxed">
              Junte-se a nossa plataforma e comece a organizar sua agenda
              profissional hoje mesmo.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
