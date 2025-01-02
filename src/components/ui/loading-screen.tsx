import { Spinner } from '@/components/ui/spinner';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Spinner className="h-8 w-8 mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);