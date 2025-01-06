import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';

export const CollaboratorPresence = () => {
  const { userEmail } = useAuth();

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <User className="w-4 h-4" />
      <span>{userEmail}</span>
    </div>
  );
};