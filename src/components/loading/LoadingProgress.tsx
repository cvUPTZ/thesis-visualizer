import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

export const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 20, 90);
        return newProgress;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <Progress value={progress} className="w-full h-2" />
      <p className="text-sm text-muted-foreground text-center animate-pulse">
        Loading your personalized dashboard...
      </p>
    </div>
  );
};