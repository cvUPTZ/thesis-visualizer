import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { EmailAuthForm } from '@/components/auth/EmailAuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LandingPage from './LandingPage';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Landing Page with reduced opacity */}
      <div className="fixed inset-0 opacity-25">
        <LandingPage />
      </div>

      {/* Auth Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 bg-[#1A1F2C]/95 p-8 rounded-2xl backdrop-blur-sm relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>

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

            <EmailAuthForm mode="signin" />
          </div>

          <p className="text-center text-sm text-gray-400">
            By continuing, you agree to our{' '}
            <a href="#" className="text-[#9b87f5] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#9b87f5] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;