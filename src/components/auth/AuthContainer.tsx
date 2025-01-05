import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AuthHeader } from './AuthHeader';
import { AuthForm } from './AuthForm';
import { AuthFooter } from './AuthFooter';

export const AuthContainer = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] flex flex-col">
      <div className="h-16 bg-[#1A1F2C] border-b border-gray-800"></div>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <AuthHeader />
          
          <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-lg">
            <CardContent className="pt-6">
              <AuthForm />
            </CardContent>
          </Card>

          <AuthFooter />
        </div>
      </main>
    </div>
  );
};