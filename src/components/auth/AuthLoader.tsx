import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const AuthLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-4 p-8">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
};