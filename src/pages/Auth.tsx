import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C]">
      <div className="bg-white/5 p-8 rounded-xl border border-white/10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Welcome Back</h1>
        <Button 
          onClick={handleLogin}
          className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          Continue to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Auth;