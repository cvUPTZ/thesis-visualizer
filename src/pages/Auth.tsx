import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<'student' | 'supervisor'>('student');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2c] via-[#2d364d] to-[#1a1f2c] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/5 backdrop-blur-lg border-white/10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-gray-300">Please sign in or create an account</p>
        </div>

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

        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#6B46C1',
                  brandAccent: '#553C9A',
                }
              }
            }
          }}
          providers={['google']}
          redirectTo={`${window.location.origin}/auth/callback`}
          onlyThirdPartyProviders={false}
          additionalData={{
            user_type: userType
          }}
        />
      </Card>
    </div>
  );
};

export default Auth;