import { Spinner } from '@/components/ui/spinner';

export interface LoadingScreenProps {
  message?: string;
  title?: string;
}

export const LoadingScreen = ({ 
  message = 'Loading...', 
  title 
}: LoadingScreenProps) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Spinner className="h-8 w-8 mb-4" />
      {title && (
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
      )}
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);