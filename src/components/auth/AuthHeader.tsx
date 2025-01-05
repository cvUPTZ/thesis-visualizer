import React from 'react';
import { GraduationCap } from 'lucide-react';

export const AuthHeader = () => {
  return (
    <div className="text-center">
      <GraduationCap className="w-12 h-12 mx-auto text-[#9b87f5] mb-4" />
      <h2 className="text-3xl font-bold text-white font-sans mb-2">
        Welcome Back
      </h2>
      <p className="text-gray-300 font-sans">
        Sign in to continue your academic journey
      </p>
    </div>
  );
};