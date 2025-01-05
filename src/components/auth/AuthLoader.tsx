import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const AuthLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1F2C]">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto bg-gray-800" />
          <Skeleton className="h-8 w-48 mx-auto bg-gray-800" />
          <Skeleton className="h-4 w-64 mx-auto bg-gray-800" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full bg-gray-800" />
          <Skeleton className="h-12 w-full bg-gray-800" />
          <Skeleton className="h-12 w-full bg-gray-800" />
        </div>
      </div>
    </div>
  );
};