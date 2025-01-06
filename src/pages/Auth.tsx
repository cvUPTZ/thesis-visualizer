import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { EmailAuthForm } from '@/components/auth/EmailAuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';

const Auth = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1F2C] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to your account</p>
        </div>

        <div className="space-y-4">
          <SocialAuth isLoading={loading} setLoading={setLoading} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1A1F2C] px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <EmailAuthForm isLoading={loading} setLoading={setLoading} />
        </div>

        <p className="text-center text-sm text-gray-400">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#9b87f5] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#9b87f5] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;