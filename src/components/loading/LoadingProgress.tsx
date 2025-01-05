import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

export const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        // Slow down progress as it gets closer to 90%
        const increment = Math.max(1, (90 - oldProgress) / 10);
        const newProgress = Math.min(oldProgress + increment, 90);
        return newProgress;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full space-y-4">
      <Progress value={progress} className="w-full h-2" />
      <p className="text-sm text-muted-foreground text-center animate-pulse">
        Loading your content...
      </p>
    </div>
  );
};