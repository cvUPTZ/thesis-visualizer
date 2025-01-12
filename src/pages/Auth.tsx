import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { EmailAuthForm } from '@/components/auth/EmailAuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'student' | 'supervisor'>('student');
  const { toast } = useToast();

  const handleError = (error: AuthError) => {
    toast({
      title: 'Authentication Error',
      description: error.message,
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2c] via-[#2d364d] to-[#1a1f2c] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/5 backdrop-blur-lg border-white/10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-gray-300">Please sign in or create an account</p>
        </div>

        {mode === 'signup' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              I am a:
            </label>
            <Select
              value={userType}
              onValueChange={(value: 'student' | 'supervisor') => setUserType(value)}
            >
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-6">
          <EmailAuthForm
            mode={mode}
            onModeChange={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            onError={handleError}
          />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1a1f2c] px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <SocialAuth
            isLoading={loading}
            setLoading={setLoading}
            onError={handleError}
            mode={mode}
            userType={userType}
          />
        </div>
      </Card>
    </div>
  );
};

export default Auth;