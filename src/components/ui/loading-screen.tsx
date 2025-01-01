import React from 'react';
import { Skeleton } from './skeleton';

interface LoadingScreenProps {
    title: string
}

export const LoadingScreen = ({title}: LoadingScreenProps) => {
    return (
         <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-6">
               <h2 className="text-2xl font-bold text-center">{title}</h2>
                <Skeleton className="h-12 w-full" />
                 <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
};