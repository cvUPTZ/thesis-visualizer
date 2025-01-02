import React from 'react';
import { Skeleton } from './skeleton';

interface LoadingScreenProps {
  title: string;
}

export const LoadingScreen = ({ title }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-4xl w-full p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">{title}</h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">Please wait...</p>
          <div className="w-full space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};