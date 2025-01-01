// src/components/ui/loading-screen.tsx
import React from 'react';
import { Skeleton } from './skeleton';

interface LoadingScreenProps {
  title: string;
}

export const LoadingScreen = ({ title }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center">{title}</h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
};